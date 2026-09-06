import React from 'react';

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '0.5px solid #dddddd',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <p style={{ fontWeight: 500, margin: '0 0 6px', color: '#0b0b0b' }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', color: p.color || '#52514e' }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color,
              marginRight: 6,
            }}
          />
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
}
