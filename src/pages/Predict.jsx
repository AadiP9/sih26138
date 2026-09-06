import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CustomTooltip from '../components/CustomTooltip';

const FUEL_TYPES = [
  { id: 'VLSFO', label: 'VLSFO', color: '#888780', factor: 1.0 },
  { id: 'LNG', label: 'LNG', color: '#1baf7a', factor: 0.85 },
  { id: 'Methanol', label: 'Methanol', color: '#2a78d6', factor: 0.78 },
  { id: 'Hydrogen', label: 'Hydrogen', color: '#6250d6', factor: 0.6 },
  { id: 'Ammonia', label: 'Ammonia', color: '#eda100', factor: 0.91 },
];

export default function Predict() {
  const [speed, setSpeed] = useState(13);
  const [load, setLoad] = useState(75);
  const [fuelType, setFuelType] = useState('LNG');

  // Formula: estConsumption = speed³ × 0.015 × (load/100) × fuelFactor
  const selectedFuelConfig = FUEL_TYPES.find((f) => f.id === fuelType) || FUEL_TYPES[1];
  const fuelFactor = selectedFuelConfig.factor;
  const estConsumption = Math.pow(speed, 3) * 0.015 * (load / 100) * fuelFactor;
  const annualConsumption = estConsumption * 280; // ~280 sailing days
  const dailyCo2 = estConsumption * (fuelType === 'Hydrogen' ? 0.05 : fuelType === 'Ammonia' ? 0.15 : 2.75);

  // Generate speed curve data for chart (speeds 8-20)
  const speedCurveData = [];
  for (let s = 8; s <= 20; s += 1) {
    const consumption = Math.pow(s, 3) * 0.015 * (load / 100) * fuelFactor;
    speedCurveData.push({
      speed: `${s} kn`,
      speedVal: s,
      Consumption: Number(consumption.toFixed(1)),
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <PageHeader
        title="Fuel Predictor"
        subtitle="XGBoost hydrodynamic speed-consumption regression models"
      />

      <div
        style={{
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* LEFT CARD — Inputs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
            Prediction inputs
          </div>

          {/* Speed Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Vessel Speed</label>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {speed.toFixed(1)} kn
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="20"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{
                width: '100%',
                marginTop: '8px',
                accentColor: 'var(--accent-dark)',
                cursor: 'pointer',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--text-dim)',
                marginTop: '4px',
              }}
            >
              <span>8 kn</span>
              <span>20 kn</span>
            </div>
          </div>

          {/* Load Factor Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Load Factor</label>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {load}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="5"
              value={load}
              onChange={(e) => setLoad(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                marginTop: '8px',
                accentColor: 'var(--accent-dark)',
                cursor: 'pointer',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--text-dim)',
                marginTop: '4px',
              }}
            >
              <span>30%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Fuel Type Pills */}
          <div>
            <label
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Fuel Type
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FUEL_TYPES.map((f) => {
                const isSelected = fuelType === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFuelType(f.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 500 : 400,
                      backgroundColor: isSelected ? `${f.color}15` : 'transparent',
                      border: `1px solid ${isSelected ? f.color : '#dddddd'}`,
                      color: isSelected ? f.color : '#52514e',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result box (bg #0F6E56 border-radius 10px padding 16px 18px color white) */}
          <div
            style={{
              backgroundColor: '#0F6E56',
              borderRadius: '10px',
              padding: '16px 18px',
              color: '#ffffff',
              boxSizing: 'border-box',
              marginTop: '4px',
            }}
          >
            <div style={{ fontSize: '12px', opacity: 0.75 }}>Predicted consumption</div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 500,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1.1,
                marginTop: '4px',
              }}
            >
              {estConsumption.toFixed(1)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '2px' }}>tonnes / day</div>

            <div
              style={{
                height: '0.5px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                margin: '14px 0',
              }}
            />

            <div style={{ fontSize: '12px', opacity: 0.85 }}>
              ≈ {Math.round(annualConsumption).toLocaleString()} t/yr · {dailyCo2.toFixed(1)} t CO₂/day
            </div>
          </div>
        </div>

        {/* RIGHT — Two cards stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1 — Speed curve chart */}
          <div className="card">
            <div>
              <h2
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Speed–consumption curve
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Cubic law · {fuelType} · {load}% load
              </p>
            </div>

            <div style={{ width: '100%', height: 180, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={speedCurveData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis
                    dataKey="speed"
                    fontSize={11}
                    tick={{ fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={11}
                    tick={{ fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="Consumption"
                    name="Consumption (t/day)"
                    stroke="#1baf7a"
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (Math.round(payload.speedVal) === Math.round(speed)) {
                        return (
                          <circle
                            key={`dot-${payload.speedVal}`}
                            cx={cx}
                            cy={cy}
                            r={5}
                            fill="#0F6E56"
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }
                      return null;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 — 3 StatCards row */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap' }}>
            <StatCard
              label="Optimal speed"
              value="12.5 kn"
              sub="min cost per tonne-mile"
              accent="#0F6E56"
            />
            <StatCard
              label="Speed savings"
              value="18.3%"
              sub="vs current avg 15.2 kn"
              accent="#1baf7a"
            />
            <StatCard
              label="Model RMSE"
              value="0.84"
              sub="t/day on validation set"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
