import React, { useState } from "react";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const API_URL = "http://localhost:8080/predict?ticker=";

export default function App() {
  const [ticker, setTicker] = useState("AAPL");
  const [pred, setPred] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchPred = async () => {
    setLoading(true);
    setErr(null);
    setPred(null);
    setHistory([]);
    try {
      const res = await fetch(API_URL + ticker);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setPred(200);
      if (Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (e) {
      console.error(e);
      setErr("Could not fetch prediction. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: history.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Previous Close",
        data: history,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
      pred
        ? {
            label: "Prediction",
            data: [...Array(history.length - 1).fill(null), pred],
            borderColor: "rgba(34,197,94,1)",
            backgroundColor: "rgba(34,197,94,0.5)",
            pointStyle: "circle",
            pointRadius: 6,
            tension: 0,
          }
        : null,
    ].filter(Boolean),
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-800/70 backdrop-blur rounded-3xl border border-gray-700 shadow-2xl p-8">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-600/20 to-green-400/10">
            <ArrowTrendingUpIcon className="w-12 h-12 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Stock Price Predictor</h1>
            <p className="text-sm text-gray-300 mt-1">Enter a ticker to see history & prediction</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Ticker (e.g. AAPL)"
            className="col-span-2 px-4 py-3 rounded-lg text-lg font-semibold text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 uppercase"
          />
          <button
            onClick={fetchPred}
            disabled={loading}
            className="px-4 py-3 rounded-lg text-lg font-semibold bg-gradient-to-br from-green-500 to-green-600 text-white shadow hover:scale-[0.995] active:scale-95 transition disabled:opacity-60"
          >
            {loading ? "Loading..." : "Predict"}
          </button>
        </div>

        {err && <div className="mt-6 text-red-400 font-semibold">{err}</div>}

        {pred && (
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-300">Next-Day Prediction</div>
            <div className="mt-1 text-3xl font-bold text-green-300">${pred}</div>
          </div>
        )}

        {history.length > 0 && (
  <div className="mt-8 bg-gray-900/50 p-4 rounded-lg">
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { labels: { color: "#fff" } }
        },
        scales: {
          x: { ticks: { color: "#fff" } },
          y: {
            ticks: { color: "#fff" },
            // Dynamic min/max scaling
            min: (() => {
              const minY = Math.min(...history, pred ? Number(pred) : Infinity);
              const maxY = Math.max(...history, pred ? Number(pred) : -Infinity);
              return minY - (maxY - minY) * 0.1; // 10% padding below
            })(),
            max: (() => {
              const minY = Math.min(...history, pred ? Number(pred) : Infinity);
              const maxY = Math.max(...history, pred ? Number(pred) : -Infinity);
              return maxY + (maxY - minY) * 0.1; // 10% padding above
            })(),
          }
        }
      }}
    />
  </div>
)}
      </div>
    </div>
  );
}

