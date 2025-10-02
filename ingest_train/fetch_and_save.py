# ingest_train/fetch_and_save.py
import sys, os
import pandas as pd
import yfinance as yf

def fetch_and_save(ticker, out_csv):
    df = yf.download(ticker, period="60d", interval="1d")
    if df.empty:
        print(f"No data for {ticker}")
        sys.exit(1)
    os.makedirs(os.path.dirname(out_csv), exist_ok=True)
    df.to_csv(out_csv)
    print(f"Saved {len(df)} rows to {out_csv}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python fetch_and_save.py TICKER OUTPUT_CSV")
        sys.exit(1)
    fetch_and_save(sys.argv[1], sys.argv[2])

