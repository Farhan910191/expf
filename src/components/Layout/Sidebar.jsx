import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  FiHome, FiGrid, FiList, FiTarget, FiBarChart2, FiBell,
  FiUser, FiShield, FiLogOut, FiArrowUpRight, FiArrowDownLeft, FiTrendingUp, FiTag
} from 'react-icons/fi';

export default function Sidebar() {
  const { logout, unreadNotifs, sidebarOpen, setSidebarOpen, isAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'OVERVIEW', type: 'section' },
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { label: 'MANAGEMENT', type: 'section' },
    { path: '/income', icon: FiArrowDownLeft, label: 'Income' },
    { path: '/expenses', icon: FiArrowUpRight, label: 'Expenses' },
    { path: '/categories', icon: FiTag, label: 'Categories' },
    { path: '/transactions', icon: FiList, label: 'Transactions' },
    { label: 'PLANNING', type: 'section' },
    { path: '/budget', icon: FiTarget, label: 'Budget' },
    { path: '/reports', icon: FiBarChart2, label: 'Reports' },
    { label: 'ACCOUNT', type: 'section' },
    { path: '/notifications', icon: FiBell, label: 'Notifications', hasNotif: true },
    { path: '/profile', icon: FiUser, label: 'Profile & Settings' },
    // Admin Panel only shows for admin users
    ...(isAdmin ? [{ path: '/admin', icon: FiShield, label: 'Admin Panel' }] : []),
  ];

  return (
    <>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99
      }} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon"><FiTrendingUp strokeWidth={3} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '20px', letterSpacing: '1px', lineHeight: 1.1 }}>MONETRA</h2>
            <span style={{ fontSize: '10px', color: 'var(--mint)', opacity: 0.8, fontWeight: 500, letterSpacing: '0.5px' }}>Personal Money Manager</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) => {
            if (item.type === 'section') {
              return <div key={i} className="sidebar-section">{item.label}</div>;
            }
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="icon" />
                <span>{item.label}</span>
                {item.hasNotif && unreadNotifs > 0 && <span className="badge-dot" />}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="nav-item w-full" onClick={logout} style={{ color: '#FFFFFF', opacity: 0.8, background: 'none', width: '100%' }}>
            <FiLogOut className="icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
