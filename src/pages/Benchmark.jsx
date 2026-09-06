import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CustomTooltip from '../components/CustomTooltip';

const radarData = [
  { subject: 'Fuel Eff.', quantum: 92, baseline: 71 },
  { subject: 'Emissions', quantum: 88, baseline: 60 },
  { subject: 'Schedule', quantum: 95, baseline: 89 },
  { subject: 'Cost', quantum: 84, baseline: 72 },
  { subject: 'Scalability', quantum: 90, baseline: 55 },
  { subject: 'Accuracy', quantum: 94, baseline: 78 },
];

const mapeData = [
  { model: 'Q-LSTM (ours)', mape: 2.8, isOurs: true },
  { model: 'GradBoost', mape: 4.1, isOurs: false },
  { model: 'RandomForest', mape: 5.7, isOurs: false },
  { model: 'SVR', mape: 6.3, isOurs: false },
  { model: 'ARIMA', mape: 8.4, isOurs: false },
];

export default function Benchmark() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <PageHeader
        title="Benchmarks"
        subtitle="Empirical performance benchmarks and algorithmic convergence metrics"
      />

      <div style={{ padding: '24px', flex: 1 }}>
        {/* STAT ROW */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <StatCard
            label="Vs classical PSO"
            value="+41%"
            sub="better solution quality"
            accent="#0F6E56"
          />
          <StatCard
            label="Convergence speed"
            value="3.8×"
            sub="faster than genetic algorithm"
            accent="#1baf7a"
          />
          <StatCard
            label="Scalability"
            value="1,200 vars"
            sub="solved in <30s"
            accent="#2a78d6"
          />
          <StatCard
            label="Forecast MAPE"
            value="2.8%"
            sub="vs 8.4% ARIMA baseline"
          />
        </div>

        {/* GRID: 2 COLUMNS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {/* Card 1 — Radar chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Multi-objective performance radar
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                  Quantum-PSO vs conventional baseline (0–100)
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#1baf7a' }} />
                  <span>Quantum-PSO</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#c3c2b7' }} />
                  <span>Baseline</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: 240, marginTop: '10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e1e0d9" />
                  <PolarAngleAxis dataKey="subject" fontSize={11} tick={{ fill: '#52514e' }} />
                  <Radar
                    name="Quantum-PSO"
                    dataKey="quantum"
                    stroke="#1baf7a"
                    fill="#1baf7a"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Baseline"
                    dataKey="baseline"
                    stroke="#c3c2b7"
                    fill="#c3c2b7"
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 — MAPE comparison bar */}
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
                Forecast model comparison
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                MAPE (%) — lower is better
              </p>
            </div>

            <div style={{ width: '100%', height: 200, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={mapeData}
                  margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
                >
                  <CartesianGrid stroke="#e1e0d9" horizontal={false} />
                  <XAxis
                    type="number"
                    fontSize={11}
                    tick={{ fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="model"
                    fontSize={11}
                    tick={{ fill: '#52514e' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="mape" name="MAPE (%)" radius={[0, 4, 4, 0]}>
                    {mapeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isOurs ? '#1baf7a' : '#c3c2b7'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
