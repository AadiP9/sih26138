import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import Optimize from './pages/Optimize';
import Scenarios from './pages/Scenarios';
import Benchmark from './pages/Benchmark';

// Initial redirect helper to ensure fresh visits land on /landing
function InitialRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('greenfleet_visited');
    if (!hasVisited && location.pathname === '/') {
      sessionStorage.setItem('greenfleet_visited', 'true');
      navigate('/landing', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
}

// Sidebar layout wrapper: flex row height 100vh, fixed sidebar left, main content flex-1 overflow-auto bg var(--bg)
function AppLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InitialRedirect />
      <Routes>
        {/* Pages without sidebar */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Application with Sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/benchmark" element={<Benchmark />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
