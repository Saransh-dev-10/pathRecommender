import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';
import { Shield, Sparkles, Plus, Trash2, Users, Briefcase, FolderGit2, BarChart2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    domain: 'Full Stack Development',
    salaryRange: '$70,000 - $95,000',
    description: '',
    experienceLevel: 'Entry Level'
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/admin/analytics');
      setAnalytics(data.analytics);
    } catch (err) {
      console.error("Admin analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJob.title.trim()) return;

    try {
      await API.post('/admin/jobs', {
        ...newJob,
        requiredSkills: [
          { skillName: 'React', minLevel: 7, weight: 1.0 },
          { skillName: 'Node.js', minLevel: 7, weight: 1.0 }
        ]
      });
      alert("New Job Role created successfully!");
      setNewJob({ title: '', domain: 'Full Stack Development', salaryRange: '$70,000 - $95,000', description: '', experienceLevel: 'Entry Level' });
      fetchAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create job role.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Loading Admin Analytics & Management Console...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/20 to-indigo-950/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard & Management Console</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">System Analytics & Catalog Management</h1>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Users</div>
              <div className="text-2xl font-black text-white mt-1">{analytics?.totalUsers || 2}</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Job Roles</div>
              <div className="text-2xl font-black text-brand-400 mt-1">{analytics?.totalJobs || 5}</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Avg Readiness</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{analytics?.averageReadinessScore || 81}%</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">Projects Catalog</div>
              <div className="text-2xl font-black text-accent-cyan mt-1">{analytics?.totalProjects || 2}</div>
            </div>
          </div>

          {/* Analytics Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Target Role Analytics */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h3 className="font-extrabold text-lg text-white mb-4">Most Recommended Target Roles</h3>
              <div className="space-y-3">
                {(analytics?.topTargetRoles || [
                  { role: 'Full Stack Developer', count: 12 },
                  { role: 'Frontend Developer', count: 8 },
                  { role: 'Node.js Backend Developer', count: 6 }
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-slate-200">{item.role}</span>
                    <span className="text-xs font-black text-brand-400">{item.count} Candidates</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Common Skill Gaps */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h3 className="font-extrabold text-lg text-white mb-4">Most Common Learner Skill Gaps</h3>
              <div className="space-y-3">
                {(analytics?.topSkillGaps || [
                  { skill: 'Docker', count: 14 },
                  { skill: 'AWS', count: 12 },
                  { skill: 'System Design', count: 10 }
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-amber-300">{item.skill}</span>
                    <span className="text-xs font-black text-amber-400">{item.count} Missing Occurrences</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Job Catalog Manager Form */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-400" />
              <span>Create New Job Role Entry</span>
            </h3>

            <form onSubmit={handleCreateJob} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Job Role Title (e.g. Senior React Developer)" 
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                required
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
              />
              <input 
                type="text" 
                placeholder="Salary Range" 
                value={newJob.salaryRange}
                onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
              />
              <input 
                type="text" 
                placeholder="Domain (e.g. Full Stack Development)" 
                value={newJob.domain}
                onChange={(e) => setNewJob({ ...newJob, domain: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
              />
              <button 
                type="submit"
                className="py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30"
              >
                Add Job to Catalog
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
