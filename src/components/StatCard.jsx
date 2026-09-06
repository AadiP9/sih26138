import React from 'react';

export default function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-2)',
        borderRadius: '10px',
        padding: '14px 18px',
        flex: 1,
        minWidth: '130px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        border: '0.5px solid var(--border)',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-dim)',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: '26px',
          fontWeight: 500,
          color: accent || 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>

      {sub && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-dim)',
            marginTop: '2px',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
