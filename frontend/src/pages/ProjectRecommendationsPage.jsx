import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';
import { FolderGit2, Sparkles, CheckCircle2, Clock, Code2, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ProjectRecommendationsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/recommendations');
      setData(res.data);
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (projectId, status) => {
    try {
      await API.put(`/projects/${projectId}/status`, { status });
      fetchProjects();
    } catch (err) {
      alert("Failed to update project status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-brand-400 font-bold">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Matching Recommended Projects to Skill Gaps...</span>
          </div>
        </div>
      </div>
    );
  }

  const projects = data?.projects || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header Banner */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-900 via-brand-950/40 to-indigo-950/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span>AI Project Portfolio Recommender</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Recommended Projects for {data?.targetRole || 'your learning goal'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              High-impact portfolio projects designed specifically to bridge your identified skill gaps.
            </p>
          </div>

          {/* Projects List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj._id} className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white">{proj.title}</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                          {proj.difficulty || 'Intermediate'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${
                      proj.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : proj.status === 'In Progress'
                        ? 'bg-brand-500/10 text-brand-300 border-brand-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {proj.description}
                  </p>

                  {/* Why Recommended Callout */}
                  <div className="mt-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{proj.whyRecommended}</span>
                  </div>

                  {/* Developed Skills */}
                  <div className="mt-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Skills Developed</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.skillsDeveloped || []).map((sk, sIdx) => (
                        <span key={sIdx} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{proj.estimatedHours || 20} Hours Effort
                  </div>

                  <div className="flex items-center gap-1.5">
                    {['Planned', 'In Progress', 'Completed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(proj._id, st)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                          proj.status === st
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default ProjectRecommendationsPage;
