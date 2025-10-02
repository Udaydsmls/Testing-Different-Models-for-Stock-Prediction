cmake_minimum_required(VERSION 3.10)
project(stock_server)
set(CMAKE_CXX_STANDARD 17)

find_package(Threads REQUIRED)

# ONNX Runtime
set(ONNXRUNTIME_ROOT "/opt/onnxruntime-linux-x64-1.15.1")  # adjust if needed
include_directories(${ONNXRUNTIME_ROOT}/include)
link_directories(${ONNXRUNTIME_ROOT}/lib)

# httplib single-header location
include_directories(${CMAKE_SOURCE_DIR})

add_executable(stock_server main.cpp)

target_link_libraries(stock_server
  Threads::Threads
  onnxruntime   # links libonnxruntime.so
)

