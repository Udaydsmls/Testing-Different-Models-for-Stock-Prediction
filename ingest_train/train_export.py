# ingest_train/train_export.py
import sys, os
import numpy as np
import pandas as pd
import tensorflow as tf
import tf2onnx

def load_data(csv_path, window=10):
    df = pd.read_csv(csv_path)
    closes = df["Close"].values
    X, y = [], []
    for i in range(len(closes) - window):
        X.append(closes[i : i + window])
        y.append(closes[i + window])
    X = np.array(X)[..., None].astype(np.float32)
    y = np.array(y).astype(np.float32)
    return X, y

def build_and_train(X, y, epochs=5):
    model = tf.keras.Sequential([
        tf.keras.layers.LSTM(32, input_shape=X.shape[1:]),
        tf.keras.layers.Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    model.fit(X, y, epochs=epochs, batch_size=16)
    return model

def export_to_onnx(model, onnx_path, window):
    spec = (tf.TensorSpec((None, window, 1), tf.float32, name="input"),)
    os.makedirs(os.path.dirname(onnx_path), exist_ok=True)
    tf2onnx.convert.from_keras(model, input_signature=spec, output_path=onnx_path)
    print(f"Exported ONNX model to {onnx_path}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python train_export.py INPUT_CSV WINDOW ONNX_PATH")
        sys.exit(1)
    csv, window, onnx_out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    X, y = load_data(csv, window)
    model = build_and_train(X, y)
    export_to_onnx(model, onnx_out, window)

