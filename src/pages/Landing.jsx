import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Predict', path: '/predict' },
    { label: 'Optimize', path: '/optimize' },
    { label: 'Scenarios', path: '/scenarios' },
    { label: 'Benchmark', path: '/benchmark' },
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-inter select-none">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-[1]" />

      {/* Navbar - Fixed top-left congestion: ONLY show ⬡ GREENFLEET */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-6">
        {/* Left Logo Only */}
        <div
          onClick={() => handleNavClick('/')}
          className="font-mono font-bold tracking-widest text-[#00D4FF] text-base cursor-pointer"
        >
          ⬡ GREENFLEET
        </div>

        {/* Right Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('/login')}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => handleNavClick('/')}
            className="rounded-lg bg-[#00D4FF] px-5 py-2 text-sm font-semibold text-[#040D1A] hover:scale-105 transition-transform cursor-pointer"
          >
            Open Dashboard →
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-1 hover:text-[#00D4FF] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0A0F1E]/95 border-b border-[#1E3A5F] backdrop-blur-md px-8 py-6 flex flex-col gap-4 md:hidden z-40">
            {navLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="text-left text-white/80 hover:text-[#00D4FF] transition-colors py-2 text-sm font-medium cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('/login')}
              className="text-left text-white/80 hover:text-[#00D4FF] transition-colors py-2 text-sm font-medium cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => handleNavClick('/')}
              className="mt-2 rounded-lg bg-[#00D4FF] px-5 py-2.5 text-sm font-semibold text-[#040D1A] hover:scale-105 transition-transform text-center cursor-pointer"
            >
              Open Dashboard →
            </button>
          </div>
        )}
      </header>

      {/* Hero Content - Badge moved to be first element inside hero with pt-28 */}
      <div className="relative z-10 flex h-full flex-col justify-between pl-8 pr-8 md:pl-16 md:pr-16 pb-16 pt-28">
        {/* Top Section */}
        <div className="max-w-4xl">
          {/* Badge Pill as FIRST element inside hero */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.1)] px-4 py-2 mb-6 font-mono text-xs tracking-widest text-[#00D4FF]"
            style={{
              animation: 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
            }}
          >
            QUANTUM-INSPIRED · MARITIME · GREEN TECH
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight"
            style={{
              animation: 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
            }}
          >
            <span className="block">Smarter Fleets.</span>
            <span className="block text-[#00D4FF]">Cleaner Oceans.</span>
            <span className="block">Zero Compromise.</span>
          </h1>

          {/* Subtext */}
          <p
            className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-white/60"
            style={{
              animation: 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
            }}
          >
            Quantum-inspired AI that predicts fuel consumption and optimizes fleet
            deployment — minimizing emissions without sacrificing operational efficiency.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between pb-8">
          {/* Left Side CTA */}
          <div>
            <div
              className="flex flex-wrap items-center gap-4"
              style={{
                animation: 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both',
              }}
            >
              <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 rounded-xl bg-[#00D4FF] px-8 py-4 font-semibold text-[#040D1A] transition-all hover:bg-[#00b8e6] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] cursor-pointer"
              >
                <span>Launch GreenFleet</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate('/benchmark')}
                className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-4 font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
              >
                View Benchmarks
              </button>
            </div>

            <div
              className="mt-4 flex items-center gap-3 text-xs text-white/40 font-mono"
              style={{
                animation: 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s both',
              }}
            >
              <span>SIH 2026</span>
              <span>·</span>
              <span>Problem Statement #26138</span>
              <span>·</span>
              <span>Team Egreen Quanta</span>
            </div>
          </div>

          {/* Right Side Stats Strip */}
          <div
            className="flex items-center gap-8 border-t border-white/10 pt-6 md:border-t-0 md:pt-0"
            style={{
              animation: 'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both',
            }}
          >
            <div>
              <div className="font-mono text-2xl font-bold text-[#00D4FF]">98.15%</div>
              <div className="text-xs text-white/50 mt-1">Model Accuracy</div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div>
              <div className="font-mono text-2xl font-bold text-[#00D4FF]">&lt;1.5s</div>
              <div className="text-xs text-white/50 mt-1">Optimization Time</div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div>
              <div className="font-mono text-2xl font-bold text-[#00D4FF]">5</div>
              <div className="text-xs text-white/50 mt-1">Alternative Fuels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
