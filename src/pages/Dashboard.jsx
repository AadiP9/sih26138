import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import CustomTooltip from '../components/CustomTooltip';

const chartData = [
  { month: 'Jan', actual: 4200, predicted: 4150, baseline: 5100 },
  { month: 'Feb', actual: 3980, predicted: 4020, baseline: 5100 },
  { month: 'Mar', actual: 4350, predicted: 4300, baseline: 5100 },
  { month: 'Apr', actual: 3750, predicted: 3800, baseline: 5100 },
  { month: 'May', actual: 3620, predicted: 3650, baseline: 5100 },
  { month: 'Jun', actual: 3480, predicted: 3500, baseline: 5100 },
  { month: 'Jul', actual: 3310, predicted: 3350, baseline: 5100 },
  { month: 'Aug', actual: 3190, predicted: 3200, baseline: 5100 },
];

const vesselsData = [
  { id: 'V-041', type: 'Feeder', dwt: '1,200 DWT', fuel: 'LNG', status: 'active', speed: '14.5 kn', consumption: '32 t/day' },
  { id: 'V-082', type: 'Handymax', dwt: '3,500 DWT', fuel: 'Methanol', status: 'active', speed: '12.0 kn', consumption: '58 t/day' },
  { id: 'V-113', type: 'Panamax', dwt: '5,000 DWT', fuel: 'VLSFO', status: 'docked', speed: '0.0 kn', consumption: '0 t/day' },
  { id: 'V-156', type: 'Feeder', dwt: '1,400 DWT', fuel: 'LNG', status: 'active', speed: '15.0 kn', consumption: '36 t/day' },
  { id: 'V-209', type: 'Handysize', dwt: '2,200 DWT', fuel: 'Ammonia', status: 'transit', speed: '11.5 kn', consumption: '44 t/day' },
  { id: 'V-271', type: 'Panamax', dwt: '4,800 DWT', fuel: 'Hydrogen', status: 'active', speed: '13.8 kn', consumption: '61 t/day' },
];

export default function Dashboard() {
  const [selectedVessel, setSelectedVessel] = useState('V-041');

  const getStatusDotColor = (status) => {
    if (status === 'active') return '#1baf7a';
    if (status === 'transit') return '#2a78d6';
    return '#898781';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <PageHeader
        title="Overview"
        subtitle="Real-time maritime fleet operations and predictive telemetry"
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
            label="Fleet fuel saved"
            value="26.4%"
            sub="vs. conventional baseline"
            accent="#0F6E56"
          />
          <StatCard
            label="CO₂ reduced"
            value="1,840 t"
            sub="this quarter"
            accent="#1baf7a"
          />
          <StatCard
            label="Model accuracy"
            value="98.15%"
            sub="XGBoost R²"
            accent="#2a78d6"
          />
          <StatCard
            label="QPSO runs"
            value="342"
            sub="avg convergence"
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
          {/* CARD 1 — Fuel Consumption Chart */}
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
                  Fuel consumption — actual vs predicted
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                  Tonnes/month · quantum model vs conventional baseline
                </p>
              </div>

              {/* Legend row */}
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
                  <span>Actual</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#2a78d6' }} />
                  <span>Predicted</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#c3c2b7' }} />
                  <span>Baseline</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: 180, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis
                    dataKey="month"
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
                    domain={[2500, 5500]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    name="Baseline"
                    stroke="#c3c2b7"
                    fill="#f0efec"
                    strokeDasharray="4 3"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted"
                    stroke="#2a78d6"
                    fill="#e6f1fb"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#1baf7a"
                    fill="#e1f5ee"
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CARD 2 — Active vessels list */}
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
                Active vessels
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Real-time fleet status
              </p>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {vesselsData.map((v) => {
                const isSelected = selectedVessel === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVessel(v.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: isSelected ? '#e1f5ee' : 'transparent',
                      border: isSelected ? '0.5px solid #9FE1CB' : '0.5px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Left info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: getStatusDotColor(v.status),
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {v.id}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                        {v.type}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        · {v.dwt}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--surface-2)',
                          color: 'var(--text-secondary)',
                          border: '0.5px solid var(--border)',
                        }}
                      >
                        {v.fuel}
                      </span>
                    </div>

                    {/* Right telemetry */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {v.speed}
                      </span>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          minWidth: '55px',
                          textAlign: 'right',
                        }}
                      >
                        {v.consumption}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
