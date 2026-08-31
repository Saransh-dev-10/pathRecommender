import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosClient';
import { MapPin, Sparkles, CheckCircle2, Lock, ArrowDown, BookOpen, Clock, AlertCircle, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const LearningRoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const { data } = await API.get('/roadmap');
      setRoadmap(data);
    } catch (err) {
      console.error("Roadmap fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Your path will be rebuilt using your current skills, assessments, and learning goal. Proceed?")) {
      return;
    }

    setRegenerating(true);
    setNoticeMessage('');
    try {
      const { data } = await API.post('/roadmap/regenerate');
      await fetchRoadmap();
      setNoticeMessage(`Learning path successfully rebuilt for ${data.learningGoal}!`);
      setTimeout(() => setNoticeMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to regenerate learning path.");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-lime-400 font-bold">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Building Dependency-Aware Learning Roadmap...</span>
          </div>
        </div>
      </div>
    );
  }

  const nodes = roadmap?.nodes || [];
  const hasRoadmap = roadmap?.hasRoadmap !== false && nodes.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          
          {noticeMessage && (
            <div className="p-4 rounded-2xl bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* Header Banner */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-900 via-brand-950/40 to-indigo-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400 mb-1">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>AI Personalized Learning Roadmap</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Learning Path: {roadmap?.learningGoal || 'Your Learning Path'}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Personalized skill sequence tailored to your learning goal, prerequisites, and assessment performance.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {hasRoadmap && (
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-2 shadow-sm"
                  title="Rebuild path using latest skills and goal"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-lime-400 ${regenerating ? 'animate-spin' : ''}`} />
                  <span>{regenerating ? 'Rebuilding...' : 'Regenerate My Learning Path'}</span>
                </button>
              )}

              {hasRoadmap && (
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Overall Completion</div>
                  <div className="text-xl font-black text-lime-400">{roadmap?.progressPercentage || 0}%</div>
                </div>
              )}
            </div>
          </div>

          {!hasRoadmap ? (
            <div className="glass-panel p-8 sm:p-12 rounded-3xl border-amber-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto font-bold text-xl">
                <MapPin className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">No Learning Path Generated Yet</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Complete your profile and choose a learning goal to generate your personalized learning path.
              </p>
              <Link 
                to="/onboarding"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
              >
                <span>Set Learning Goal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="relative py-4 space-y-6">
              
              <div className="absolute left-6 sm:left-8 top-10 bottom-10 w-1 bg-slate-800 -z-0"></div>

              {nodes.map((node, idx) => {
                const isRemediation = node.isRemediation;
                const isCompleted = node.isCompleted;
                const isLocked = node.isLocked;

                return (
                  <div key={node.id} className="relative z-10 flex items-start gap-4 sm:gap-6">
                    
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xl transition ${
                      isCompleted 
                        ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400' 
                        : isRemediation
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400'
                        : isLocked
                        ? 'bg-slate-900 border-2 border-slate-800 text-slate-500'
                        : 'bg-brand-600/30 border-2 border-brand-500 text-brand-300'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : idx + 1}
                    </div>

                    <Link 
                      to={`/path/module/${node.id || node._id}`}
                      className={`flex-1 glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 hover:border-lime-400/40 transition block group shadow-lg ${
                        isRemediation ? 'bg-amber-950/20 border-amber-500/30' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-extrabold text-white group-hover:text-lime-300 transition">
                              {node.topic}
                            </h3>
                            {isRemediation && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Adaptive Remediation Node
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Category: <span className="text-slate-300 font-semibold">{node.category || 'Core'}</span> • Target: <span className="text-slate-300 font-semibold">{node.difficulty || 'Beginner'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                            isCompleted 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : isLocked
                              ? 'bg-slate-900 text-slate-500 border-slate-800'
                              : 'bg-lime-400/10 text-lime-400 border-lime-400/30'
                          }`}>
                            {node.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                        {node.whyRecommended || 'Master core prerequisites essential for modern engineering.'}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> ~{node.estimatedHours || 5} Hours</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-500" /> {(node.resources || []).length} Resources</span>
                        </div>
                        <span className="text-lime-400 font-bold group-hover:underline flex items-center gap-1">
                          <span>Open Details & Quiz</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </span>
                      </div>

                    </Link>

                  </div>
                );
              })}

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default LearningRoadmapPage;
