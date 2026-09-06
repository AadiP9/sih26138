import React from 'react';
import {
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

const emissionsData = [
  { name: 'LNG', intensity: 2.75, color: '#1baf7a' },
  { name: 'Methanol', intensity: 1.37, color: '#2a78d6' },
  { name: 'Hydrogen', intensity: 0.05, color: '#6250d6' },
  { name: 'Ammonia', intensity: 0.12, color: '#eda100' },
  { name: 'VLSFO', intensity: 3.11, color: '#888780' },
];

const fuelTableData = [
  { fuel: 'LNG', co2: '2.75', nox: '0.12', cost: '$580', readiness: 'Mature', badgeBg: '#e1f5ee', badgeColor: '#0F6E56' },
  { fuel: 'Methanol', co2: '1.37', nox: '0.08', cost: '$720', readiness: 'Emerging', badgeBg: '#e6f1fb', badgeColor: '#2a78d6' },
  { fuel: 'Hydrogen', co2: '0.00', nox: '0.04', cost: '$1,240', readiness: 'Early', badgeBg: '#fef3d6', badgeColor: '#eda100' },
  { fuel: 'Ammonia', co2: '0.00', nox: '0.19', cost: '$890', readiness: 'Early', badgeBg: '#fef3d6', badgeColor: '#eda100' },
  { fuel: 'VLSFO', co2: '3.11', nox: '0.18', cost: '$460', readiness: 'Mature', badgeBg: '#e1f5ee', badgeColor: '#0F6E56' },
];

export default function Scenarios() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <PageHeader
        title="Emissions"
        subtitle="Well-to-wake lifecycle environmental impact and alternative fuel analysis"
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
            label="CO₂ intensity"
            value="2.1 g/t·nm"
            sub="↓38% vs 2020 baseline"
            accent="#0F6E56"
          />
          <StatCard
            label="CII rating"
            value="A"
            sub="Carbon Intensity Indicator"
            accent="#1baf7a"
          />
          <StatCard
            label="EU ETS cost"
            value="€142K"
            sub="this quarter"
          />
          <StatCard
            label="GHG lifecycle"
            value="−44%"
            sub="LNG fleet vs VLSFO"
            accent="#2a78d6"
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
          {/* Card 1 — Fuel bar chart */}
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
                Alternative fuel comparison
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                CO₂ intensity (kg/kWh) by fuel type
              </p>
            </div>

            <div style={{ width: '100%', height: 200, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emissionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis
                    dataKey="name"
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
                  <Bar dataKey="intensity" name="CO₂ (kg/kWh)" radius={[4, 4, 0, 0]}>
                    {emissionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 — Fuel comparison table */}
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
                Fuel cost vs emission trade-off
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Cost ($/tonne) · emission factors
              </p>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid #f0efec', color: '#898781', fontWeight: 400 }}>
                    <th style={{ padding: '8px 10px', fontWeight: 400 }}>Fuel</th>
                    <th style={{ padding: '8px 10px', fontWeight: 400 }}>CO₂ kg/kWh</th>
                    <th style={{ padding: '8px 10px', fontWeight: 400 }}>NOx g/kWh</th>
                    <th style={{ padding: '8px 10px', fontWeight: 400 }}>Cost $/t</th>
                    <th style={{ padding: '8px 10px', fontWeight: 400 }}>Readiness</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelTableData.map((row) => (
                    <tr key={row.fuel} style={{ borderBottom: '0.5px solid #f0efec' }}>
                      <td style={{ padding: '9px 10px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {row.fuel}
                      </td>
                      <td style={{ padding: '9px 10px', color: 'var(--text-secondary)' }}>
                        {row.co2}
                      </td>
                      <td style={{ padding: '9px 10px', color: 'var(--text-secondary)' }}>
                        {row.nox}
                      </td>
                      <td style={{ padding: '9px 10px', color: 'var(--text-primary)', fontFamily: "'IBM Plex Mono', monospace" }}>
                        {row.cost}
                      </td>
                      <td style={{ padding: '9px 10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: row.badgeBg,
                            color: row.badgeColor,
                            fontWeight: 500,
                          }}
                        >
                          {row.readiness}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
