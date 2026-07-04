import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const MENU = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/movies', icon: '🎬', label: 'Movies' },
  { to: '/series', icon: '📺', label: 'Series' },
  { to: '/trending', icon: '🔥', label: 'Trending' },
  { to: '/new', icon: '✨', label: 'New' },
  { to: '/dashboard', icon: '🔖', label: 'My List' },
  { to: '/search', icon: '🔍', label: 'Search' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            XEN<span>FLIX</span>
          </Link>
        </div>
        <nav className="sidebar__nav">
          {MENU.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar__link ${location.pathname === to ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__icon">{icon}</span>
              <span className="sidebar__label">{label}</span>
              {location.pathname === to && <span className="sidebar__active-bar" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar__footer">
          <p className="sidebar__footer-text">XENFLIX © 2025</p>
          <p className="sidebar__footer-sub">Free streaming — No ads</p>
        </div>
      </aside>
    </>
  );
}
