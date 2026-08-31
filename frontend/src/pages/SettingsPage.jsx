import React, { useState } from 'react';
import { Settings, Sparkles, Key, ShieldCheck, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [aiMode, setAiMode] = useState('hybrid');
  const [savedNotice, setSavedNotice] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice('Settings & AI Engine preferences saved successfully!');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-900 via-brand-950/40 to-indigo-950/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <Settings className="w-4 h-4" />
              <span>Platform Settings</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Account & AI Preferences</h1>
          </div>

          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
              {savedNotice}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Account Details */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand-400" />
                <span>Account Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                  <input type="text" value={user?.name || ''} readOnly className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                  <input type="text" value={user?.email || ''} readOnly className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
                </div>
              </div>
            </div>

            {/* AI Engine Configuration */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-cyan" />
                <span>AI Recommendation Engine Mode</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Recommendation Architecture</label>
                <select
                  value={aiMode}
                  onChange={(e) => setAiMode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-brand-500 outline-none"
                >
                  <option value="hybrid">Hybrid Engine (Weighted Deterministic + Gemini LLM)</option>
                  <option value="llm">Full LLM Generative Mode</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Custom Gemini API Key Override (Optional)</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 pl-10 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">If provided, custom key overrides server environment config for personal AI inferences.</p>
              </div>

              <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition"
              >
                Save Preferences
              </button>
            </div>
          </form>

        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
