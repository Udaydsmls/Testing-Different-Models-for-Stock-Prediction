// cpp_server/main.cpp
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

// ONNX Runtime C++ API
#include <onnxruntime_cxx_api.h>

// single-header HTTP server
#include "httplib.h"

using namespace httplib;

// Load last N close prices from CSV:
std::vector<float> load_closes(const std::string& csv, int window) {
    std::ifstream in(csv);
    if (!in) throw std::runtime_error("Cannot open CSV: " + csv);
    std::string line;
    std::vector<float> closes;
    std::getline(in, line); // skip header
    while (std::getline(in, line)) {
        std::stringstream ss(line);
        std::string cell;
        int col = 0;
        float close = 0;
        while (std::getline(ss, cell, ',')) {
            if (col == 4) close = std::stof(cell);
            col++;
        }
        closes.push_back(close);
    }
    if ((int)closes.size() < window)
        throw std::runtime_error("Not enough data rows");
    return {closes.end() - window, closes.end()};
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " CSV_PATH WINDOW PORT\n";
        return 1;
    }
    const std::string csv_path = argv[1];
    const int window = std::stoi(argv[2]);
    const int port = std::stoi(argv[3]);
    const std::string model_path = "model/lstm.onnx";

    // Initialize ONNX Runtime
    Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "stock");
    Ort::SessionOptions opts;
    Ort::Session session(env, model_path.c_str(), opts);

    // MemoryInfo for CreateTensor
    auto memory_info = Ort::MemoryInfo::CreateCpu(
        OrtAllocatorType::OrtArenaAllocator,
        OrtMemTypeDefault
    );

    Server svr;
    
    svr.Options("/predict", [&](const Request& /*req*/, Response& res) {
  res.set_header("Access-Control-Allow-Origin", "*");       
  res.set_header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set_header("Access-Control-Allow-Headers", "Content-Type");
  res.status = 200;
  });
    
    svr.Get("/predict", [&](const Request& req, Response& res) {
        try {
            // 1) Load the last window closes
            auto closes = load_closes(csv_path, window);
            

            // 2) Prepare input tensor
            std::vector<int64_t> dims = {1, window, 1};
            std::vector<float> input_vals = closes;
            if(closes.size() > 10) {
              dims = {1, 10, 1};
              input_vals.clear();
              for(int i = 0; i < 10; i++) {
                input_vals.push_back(closes[closes.size() - 1 - i]);
              }
              reverse(input_vals.begin(), input_vals.end());
            }

            Ort::Value input_tensor = Ort::Value::CreateTensor<float>(
                memory_info,
                input_vals.data(), input_vals.size(),
                dims.data(), dims.size()
            );

            // 3) Run inference
            const char* input_names[] = {"input"};
            const char* output_names[] = {"dense"};
            auto output_tensors = session.Run(
                Ort::RunOptions{nullptr},
                input_names, &input_tensor, 1,
                output_names, 1
            );
            float prediction = output_tensors.front()
                                   .GetTensorMutableData<float>()[0];

            // 4) Build JSON with both prediction and history
            std::ostringstream json;
            json << "{";
            json << "\"prediction\":" << prediction << ",";
            json << "\"history\":[";
            for (size_t i = 0; i < closes.size(); ++i) {
                json << closes[i];
                if (i != closes.size() - 1) json << ",";
            }
            json << "]";
            json << "}";
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content(json.str(), "application/json");
        }
        catch (const std::exception& e) {
            res.status = 500;
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content(std::string("Error: ") + e.what(), "text/plain");
        }
    });

    std::cout << "Listening on port " << port << " …\n";
    svr.listen("0.0.0.0", port);
    return 0;
}

