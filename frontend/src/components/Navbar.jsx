import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosClient';
import { User, LogOut, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-900/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <span className="text-accent text-xl font-bold">✦</span>
          <div>
            <span className="font-semibold text-lg tracking-tight text-surface-100">
              PathRecommender
            </span>
            <span className="hidden sm:block text-[10px] text-surface-400 -mt-0.5 tracking-wide">
              Your skills. Your goal. Your path.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className="px-3.5 py-2 text-sm font-medium text-surface-400 hover:text-surface-100 transition">
              Dashboard
            </Link>
            <Link to="/path" className="px-3.5 py-2 text-sm font-medium text-surface-400 hover:text-surface-100 transition">
              My Path
            </Link>
            <Link to="/assessment" className="px-3.5 py-2 text-sm font-medium text-surface-400 hover:text-surface-100 transition">
              Assessments
            </Link>
            <Link to="/chat" className="px-3.5 py-2 text-sm font-medium text-accent hover:text-accent-light transition">
              AI Assistant
            </Link>
          </nav>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link to="/admin" className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-surface-400 hover:text-surface-100 transition">
                  <Shield className="w-3.5 h-3.5" /> Admin
                </Link>
              )}

              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-800 transition">
                <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-surface-200">{user.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-surface-500 hover:text-surface-200 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-400 hover:text-surface-100 transition">
                Sign In
              </Link>
              <Link to="/register" className="btn-accent text-sm py-2 px-5">
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
