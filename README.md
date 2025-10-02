# 📈 Stock Price Prediction & Visualization

A simple end-to-end project combining **Data Science (Python, TensorFlow)**, **C++ (ONNX Runtime for inference)**, and a **React frontend**.

- **Python**: Fetch stock data, train LSTM, export to ONNX
- **C++**: Serve predictions over HTTP
- **React**: User interface to query predictions

---

## 🚀 Features

- Fetches live stock data using [yfinance](https://pypi.org/project/yfinance/)
- Trains a simple **LSTM model** for next-day price prediction
- Exports model to **ONNX** for fast inference in C++
- C++ HTTP server serves predictions at `/predict` endpoint
- React frontend queries the server and displays predictions

---

## 🗂 Project Structure

```
stock-predictor/
├── ingest_train/       # Python data + training
│   ├── fetch_and_save.py
│   ├── train_export.py
│   └── model/          # saved ONNX models
├── cpp_server/         # C++ inference server
│   ├── main.cpp
│   ├── CMakeLists.txt
│   └── Simple-Web-Server/
├── frontend/           # React frontend
│   ├── src/
│   │   └── App.js
│   └── public/
└── README.md
```

---

## ⚙️ Setup & Usage

### 1. Python (Data + Training)

```bash
cd ingest_train
python3 -m venv venv
source venv/bin/activate
pip install yfinance pandas tensorflow tf2onnx

# Fetch stock data
python fetch_and_save.py AAPL data/AAPL.csv

# Train model and export to ONNX
python train_export.py data/AAPL.csv 10 model/lstm.onnx
```

---

### 2. C++ Server (Inference API)

```bash
cd cpp_server
mkdir build && cd build
cmake ..
make

# Run server
./stock_server ../AAPL.csv 60 8080
```

Server runs at:  
`http://localhost:8080/predict?ticker=AAPL`

---

### 3. React Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at:  
`http://localhost:3000`

---

## 🎨 Frontend Preview

![Frontend Screenshot](frontend_img.png)

---

## 📌 Roadmap

- [ ] Add support for multiple tickers dynamically
- [ ] Improve model accuracy with more features (volume, indicators)
- [ ] Deploy via Docker
