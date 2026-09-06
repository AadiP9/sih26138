import React from 'react';

export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  color = '#0F6E56',
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-2)',
        border: '0.5px solid var(--border)',
        borderRadius: '10px',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minWidth: '130px',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-dim)',
          marginBottom: '4px',
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          marginTop: '4px',
        }}
      >
        <span
          style={{
            fontSize: '26px',
            fontWeight: 500,
            color: color,
            lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-dim)',
              marginLeft: '4px',
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-dim)',
            marginTop: '2px',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
