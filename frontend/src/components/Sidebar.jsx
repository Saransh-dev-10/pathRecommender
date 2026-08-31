import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosClient';
import {
  LayoutDashboard, User, CheckSquare, MapPin, FolderGit2,
  MessageSquare, Settings, Shield, Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const [profileSummary, setProfileSummary] = useState(null);

  useEffect(() => {
    if (user) {
      API.get('/profile')
        .then(res => setProfileSummary(res.data))
        .catch(err => console.error("Sidebar profile fetch error:", err));
    }
  }, [user]);

  const navSections = [
    {
      label: 'Learn',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Path', path: '/path', icon: MapPin },
        { label: 'Assessments', path: '/assessment', icon: CheckSquare },
        { label: 'Projects', path: '/projects', icon: FolderGit2 },
      ]
    },
    {
      label: 'AI',
      items: [
        { label: 'AI Learning Assistant', path: '/chat', icon: MessageSquare },
      ]
    },
    {
      label: 'Profile',
      items: [
        { label: 'My Skills', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  if (user?.role === 'admin') {
    navSections.push({
      label: 'Admin',
      items: [{ label: 'Admin Panel', path: '/admin', icon: Shield }]
    });
  }

  const profile = profileSummary?.profile;
  const skillAnalysis = profileSummary?.skillAnalysis;
  const isProfileComplete = profile?.onboardingCompleted && (profile?.skills || []).length > 0;

  return (
    <aside className="w-60 bg-surface-900 border-r border-white/[0.06] hidden lg:flex flex-col min-h-[calc(100vh-4rem)] p-4 select-none shrink-0">
      
      {/* Learning Goal Banner */}
      {isProfileComplete && profile?.learningGoal ? (
        <div className="p-4 mb-5 rounded-xl bg-surface-800 border border-white/[0.06]">
          <div className="label-muted text-accent mb-1.5">Learning Goal</div>
          <div className="font-semibold text-sm text-surface-100 truncate">
            {profile.learningGoal}
          </div>
          {skillAnalysis && (
            <div className="mt-3 text-xs text-surface-400">
              <span className="text-accent font-semibold">{skillAnalysis.missingSkills?.length || 0}</span> skills to learn
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 mb-5 rounded-xl bg-surface-800 border border-accent/20">
          <div className="label-muted text-accent mb-1.5">Get Started</div>
          <p className="text-xs text-surface-400 leading-relaxed">
            Set up your skills and learning goal to generate your path.
          </p>
          <Link 
            to="/onboarding"
            className="mt-3 inline-block w-full py-2 text-center text-xs font-semibold rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition"
          >
            Build My Path →
          </Link>
        </div>
      )}

      {/* Nav Sections */}
      <div className="space-y-5 flex-1">
        {navSections.map(section => (
          <div key={section.label}>
            <div className="label-muted px-3 mb-2">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition group ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.04] text-[10px] text-surface-500 text-center">
        PathRecommender v2.0
      </div>
    </aside>
  );
};

export default Sidebar;
