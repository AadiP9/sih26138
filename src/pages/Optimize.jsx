import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CustomTooltip from '../components/CustomTooltip';

// Convergence data: iterations 0, 10, 20... 100
const convergenceData = [
  { iter: 0, quantum: 100, pso: 100, ga: 100 },
  { iter: 10, quantum: 78, pso: 91, ga: 95 },
  { iter: 20, quantum: 61, pso: 83, ga: 88 },
  { iter: 30, quantum: 48, pso: 76, ga: 82 },
  { iter: 40, quantum: 38, pso: 70, ga: 77 },
  { iter: 50, quantum: 30, pso: 65, ga: 73 },
  { iter: 60, quantum: 24, pso: 62, ga: 70 },
  { iter: 70, quantum: 19, pso: 59, ga: 67 },
  { iter: 80, quantum: 15, pso: 57, ga: 65 },
  { iter: 90, quantum: 12, pso: 56, ga: 64 },
  { iter: 100, quantum: 10, pso: 55, ga: 63 },
];

// Vessel utilization data: Feeder=88% Handysize=79% Handymax=94% Panamax=71%
const utilizationData = [
  { type: 'Feeder', utilization: 88 },
  { type: 'Handysize', utilization: 79 },
  { type: 'Handymax', utilization: 94 },
  { type: 'Panamax', utilization: 71 },
];

export default function Optimize() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <PageHeader
        title="Fleet Optimizer"
        subtitle="Quantum-behaved PSO multi-objective speed, fuel and vessel allocation"
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
            label="Optimal vessel mix"
            value="6 vessels"
            sub="2 Feeders · 2 Handymax · 2 Panamax"
            accent="#0F6E56"
          />
          <StatCard
            label="Total fuel saved"
            value="34.2%"
            sub="vs unoptimized fleet"
            accent="#1baf7a"
          />
          <StatCard
            label="Demand coverage"
            value="99.7%"
            sub="all routes satisfied"
            accent="#2a78d6"
          />
          <StatCard
            label="Cost reduction"
            value="$2.4M"
            sub="annualized"
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
          {/* Card 1 — Convergence chart */}
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
                  Quantum vs conventional — score convergence
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                  Objective function value (normalized) by iteration
                </p>
              </div>

              {/* Legend */}
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
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#2a78d6' }} />
                  <span>Classical PSO</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#eda100' }} />
                  <span>Genetic Alg.</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: 200, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={convergenceData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis
                    dataKey="iter"
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
                    dataKey="quantum"
                    name="Quantum-PSO"
                    stroke="#1baf7a"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="pso"
                    name="Classical PSO"
                    stroke="#2a78d6"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="ga"
                    name="Genetic Alg."
                    stroke="#eda100"
                    strokeWidth={2}
                    strokeDasharray="3 2"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 — Vessel utilization horizontal bars */}
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
                Vessel allocation — optimal deployment
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Capacity utilization per vessel type
              </p>
            </div>

            <div style={{ width: '100%', height: 200, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={utilizationData}
                  margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
                >
                  <CartesianGrid stroke="#e1e0d9" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    fontSize={11}
                    tick={{ fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="type"
                    fontSize={11}
                    tick={{ fill: '#52514e' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="utilization"
                    name="Capacity Utilization"
                    fill="#1baf7a"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
