import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Overview', icon: '▦', path: '/' },
  { label: 'Fuel Predictor', icon: '◈', path: '/predict' },
  { label: 'Fleet Optimizer', icon: '⊞', path: '/optimize' },
  { label: 'Emissions', icon: '◉', path: '/scenarios' },
  { label: 'Benchmarks', icon: '▲', path: '/benchmark' },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        flexShrink: 0,
        height: '100vh',
        backgroundColor: '#0F6E56',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        zIndex: 50,
      }}
    >
      {/* Decorative Quantum Wave Texture */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.06,
          pointerEvents: 'none',
        }}
        viewBox="0 0 220 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-20 80 Q 50 40 110 80 T 240 80"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 180 Q 60 140 120 180 T 250 180"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 280 Q 40 240 110 280 T 240 280"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 380 Q 70 340 130 380 T 250 380"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 480 Q 50 440 110 480 T 240 480"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 580 Q 60 540 120 580 T 250 580"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-20 680 Q 40 640 110 680 T 240 680"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* LOGO SECTION */}
      <div
        style={{
          padding: '0 20px 24px',
          borderBottom: '0.5px solid rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: '#ffffff',
            flexShrink: 0,
          }}
        >
          ⬡
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontWeight: 500,
              fontSize: '14px',
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            Egreen Quanta
          </span>
          <span
            style={{
              fontSize: '11px',
              opacity: 0.7,
              color: '#ffffff',
              lineHeight: 1.2,
              marginTop: '2px',
            }}
          >
            Fleet Platform
          </span>
        </div>
      </div>

      {/* NAV SECTION */}
      <nav
        style={{
          padding: '16px 12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '2px',
              fontSize: '13px',
              textAlign: 'left',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
              fontWeight: isActive ? 500 : 400,
              boxSizing: 'border-box',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* FLEET HEALTH SECTION */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '0.5px solid rgba(255,255,255,0.2)',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: '11px',
            opacity: 0.6,
            marginBottom: '6px',
            color: '#ffffff',
          }}
        >
          Fleet health
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '82%',
                height: '100%',
                backgroundColor: '#5DCAA5',
                borderRadius: '2px',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#ffffff',
            }}
          >
            82%
          </span>
        </div>

        <div
          style={{
            fontSize: '11px',
            opacity: 0.6,
            marginTop: '8px',
            color: '#ffffff',
          }}
        >
          6 vessels · 4 active
        </div>
      </div>
    </aside>
  );
}
