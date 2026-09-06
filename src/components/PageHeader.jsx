import React from 'react';

export default function PageHeader({ title, subtitle }) {
  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '0.5px solid var(--border)',
        padding: '16px 28px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Left */}
      <div>
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-dim)',
              margin: '2px 0 0 0',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Right */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            backgroundColor: '#eaf3de',
            borderRadius: '6px',
            padding: '5px 10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#3B6D11',
            }}
          />
          <span
            style={{
              fontSize: '12px',
              color: '#3B6D11',
              fontWeight: 500,
            }}
          >
            System nominal
          </span>
        </div>

        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-dim)',
          }}
        >
          Q3 2026 · Atlantic Route
        </span>
      </div>
    </header>
  );
}
