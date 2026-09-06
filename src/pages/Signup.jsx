import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Password strength calculation
  const getStrength = (pass) => {
    if (!pass) return 0;
    if (pass.length < 6) return 1;
    if (pass.length <= 8) return 2;
    if (pass.length <= 10) return 3;
    return 4;
  };

  const strength = getStrength(password);

  const getBarColor = (index, currentStrength) => {
    if (index > currentStrength) return '#e1e0d9';
    if (currentStrength === 1) return 'var(--red)';
    if (currentStrength === 2) return 'var(--amber)';
    if (currentStrength === 3) return '#1baf7a';
    return '#0F6E56';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, organization, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('greenfleet_token', data.token);
        }
        navigate('/');
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.detail || 'Could not complete registration. Please try again.');
      }
    } catch {
      // Demo fallback
      localStorage.setItem('greenfleet_token', 'demo_signup_token_2026');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '0.5px solid var(--border)',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '440px',
          boxSizing: 'border-box',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Top */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#0F6E56',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
            }}
          >
            ⬡
          </div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginTop: '12px',
              letterSpacing: '-0.01em',
            }}
          >
            Create your account
          </h2>
          <div
            style={{
              fontSize: '13px',
              color: '#898781',
              marginTop: '4px',
              textAlign: 'center',
            }}
          >
            Start optimizing your fleet today
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginTop: '28px',
          }}
        >
          {/* Full Name */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: '12px',
                color: '#52514e',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aryaman Singh"
              className="input-base"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Organization */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: '12px',
                color: '#52514e',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Organization
            </label>
            <input
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Egreen Quanta"
              className="input-base"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: '12px',
                color: '#52514e',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-base"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: '12px',
                color: '#52514e',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-base"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />

            {/* Password strength indicator */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '3px',
                height: '3px',
                marginTop: '8px',
              }}
            >
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: '100%',
                    borderRadius: '2px',
                    backgroundColor: getBarColor(idx, strength),
                    transition: 'background-color 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '11px',
              backgroundColor: '#0F6E56',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 500,
              marginTop: '8px',
            }}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          {/* Error Message */}
          {error && (
            <div
              style={{
                color: 'var(--red)',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div
          style={{
            fontSize: '12px',
            color: '#898781',
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#0F6E56',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Sign in →
          </span>
        </div>
      </div>

      <div
        style={{
          fontSize: '11px',
          color: '#c3c2b7',
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        SIH 2026 · Problem #26138 · Egreen Quanta
      </div>
    </div>
  );
}
