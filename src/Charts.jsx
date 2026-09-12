import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { asset } from "./App.jsx";
const font = { family: "Inter, sans-serif", size: 12 };
export function BarChart({ labels, values, colors }) {
  const ref = useRef(null),
    chartRef = useRef(null);
  useEffect(() => {
    chartRef.current = new Chart(ref.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.9,
            categoryPercentage: 0.85,
            maxBarThickness: 28,
            hoverBorderWidth: 2,
            hoverBorderColor: "#555",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: { padding: 0 },
        scales: {
          x: { display: false, offset: true },
          y: { display: false, min: 0, max: 40 },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: "rgba(0,0,0,.84)",
            padding: 8,
            cornerRadius: 8,
            titleFont: font,
            bodyFont: font,
            callbacks: {
              label: (c) =>
                Math.round(c.parsed.y * 1000).toLocaleString("en-US"),
            },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [JSON.stringify(labels), JSON.stringify(values), JSON.stringify(colors)]);
  return (
    <div className="bar-chart">
      <div className="y-axis">
        {["30K", "20K", "10K", "0"].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <div className="bar-plot">
        <div className="bar-canvas">
          <canvas
            ref={ref}
            role="img"
            aria-label={labels
              .map(
                (l, i) =>
                  l + ": " + Math.round(values[i] * 1000).toLocaleString(),
              )
              .join(", ")}
          />
        </div>
        <div className="x-labels">
          {labels.map((l) => (
            <span key={l}>
              {l === "Windows" ? (
                <>
                  Wind
                  <br />
                  ows
                </>
              ) : (
                l
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
function LiveLine({ mode, showThis, showLast, factor }) {
  const ref = useRef(null);
  useEffect(() => {
    const mult =
      mode === "Total Users" ? 1 : mode === "Total Projects" ? 0.58 : 0.82;
    const first = [12, 7, 14, 24, 28, 20, 24],
      last = [5, 14, 18, 7, 14, 24, 32];
    const chart = new Chart(ref.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "This year",
            data: first.map((v) => v * factor * mult),
            borderColor: "#111",
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 3,
            tension: 0.42,
            hidden: !showThis,
          },
          {
            label: "Last year",
            data: last.map((v) => v * factor * mult),
            borderColor: "#a0bce8",
            borderWidth: 1,
            borderDash: [2, 4],
            pointRadius: 0,
            pointHoverRadius: 3,
            tension: 0.42,
            hidden: !showLast,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            titleFont: font,
            bodyFont: font,
            callbacks: {
              label: (c) =>
                c.dataset.label +
                ": " +
                Math.round(c.parsed.y * 1000).toLocaleString(),
            },
          },
        },
        scales: {
          x: { display: false },
          y: { display: false, min: 0, max: 36 },
        },
        layout: { padding: { top: 0, bottom: 28 } },
      },
    });
    return () => chart.destroy();
  }, [mode, showThis, showLast, factor]);
  return <canvas ref={ref} role="img" aria-label={mode + " trend"} />;
}
export function TrendChart({ factor }) {
  const [mode, setMode] = useState("Total Users"),
    [showThis, setThis] = useState(true),
    [showLast, setLast] = useState(true),
    [point, setPoint] = useState(null);
  const original =
    mode === "Total Users" && showThis && showLast && factor === 1;
  return (
    <article className="chart-card trend">
      <div className="trend-controls">
        <div role="tablist" aria-label="Trend metric">
          {["Total Users", "Total Projects", "Operating Status"].map((t) => (
            <button
              role="tab"
              key={t}
              aria-selected={mode === t}
              className={mode === t ? "active" : ""}
              onClick={() => setMode(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="legend-divider">|</span>
        <button
          className={"year " + (!showThis ? "off" : "")}
          aria-pressed={showThis}
          onClick={() => setThis(!showThis)}
        >
          This year
        </button>
        <button
          className={"year " + (!showLast ? "off" : "")}
          aria-pressed={showLast}
          onClick={() => setLast(!showLast)}
        >
          Last year
        </button>
      </div>
      <div className="trend-chart">
        <div className="y-axis">
          {["30K", "20K", "10K", "0"].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div
          className="line-plot"
          onMouseMove={(e) => {
            if (original) {
              const b = e.currentTarget.getBoundingClientRect();
              setPoint(
                Math.min(
                  6,
                  Math.max(0, Math.floor(((e.clientX - b.left) / b.width) * 7)),
                ),
              );
            }
          }}
          onMouseLeave={() => setPoint(null)}
        >
          {original ? (
            <img
              className="original-lines"
              src={asset("lines")}
              alt="Total Users: this year and last year, January to July"
            />
          ) : (
            <LiveLine
              mode={mode}
              showThis={showThis}
              showLast={showLast}
              factor={factor}
            />
          )}
          <div className="x-labels">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          {original && point !== null && (
            <div
              className="chart-tooltip"
              style={{ left: Math.min(75, point * 14) + "%" }}
            >
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][point]}
              <br />
              {[12000, 7000, 14000, 24000, 28000, 20000, 24000][
                point
              ].toLocaleString()}{" "}
              users
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
export function Locations() {
  const [selected, setSelected] = useState(null);
  const regions = [
    ["United States", "52.1%"],
    ["Canada", "22.8%"],
    ["Mexico", "13.9%"],
    ["Other", "11.2%"],
  ];
  return (
    <article className="chart-card locations">
      <h3>Traffic by Location</h3>
      <div className="location-rows">
        {["donut-a", "donut-b"].map((image, i) => (
          <div className="location-row" key={image}>
            <button
              className="donut"
              aria-label={"Inspect location distribution " + (i + 1)}
              onClick={() => setSelected(selected === i ? null : i)}
            >
              <img
                src={asset(image)}
                width="120"
                height="120"
                alt="United States 52.1%, Canada 22.8%, Mexico 13.9%, Other 11.2%"
              />
              {selected === i && (
                <span className="donut-caption">
                  United States
                  <br />
                  52.1%
                </span>
              )}
            </button>
            <ul>
              {regions.map(([name, v]) => (
                <li key={name}>
                  <span>{name}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
