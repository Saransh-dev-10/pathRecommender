import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axiosClient';
import {
  Sparkles, Target, MapPin, Activity, CheckCircle2,
  AlertCircle, ArrowRight, Zap, TrendingUp, Award, Clock,
  BookOpen, Layers, ShieldCheck, BarChart3, ChevronRight,
  Plus, Check, X, Flame, FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingSkills, setAddingSkills] = useState({}); // { skillName: 'loading' | 'added' | 'error' }
  const [selectedSkill, setSelectedSkill] = useState(null); // for skill detail panel
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get('/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPath = async (skillName) => {
    if (addingSkills[skillName] === 'loading' || addingSkills[skillName] === 'added') return;

    setAddingSkills(prev => ({ ...prev, [skillName]: 'loading' }));
    try {
      const { data } = await API.post('/dashboard/add-to-path', { skillName });

      if (data.alreadyExists) {
        setAddingSkills(prev => ({ ...prev, [skillName]: 'added' }));
      } else {
        setAddingSkills(prev => ({ ...prev, [skillName]: 'added' }));

        // Update local state from server response
        setDashboardData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            kpis: {
              ...prev.kpis,
              pathProgress: {
                ...prev.kpis.pathProgress,
                total: data.updatedPathLength
              },
              skillsToStrengthen: (data.remainingSkillGaps || []).length
            },
            skillsToStrengthen: prev.skillsToStrengthen.filter(
              s => s.skillName.toLowerCase() !== skillName.toLowerCase()
            )
          };
        });
      }
    } catch (err) {
      console.error('Add to path error:', err);
      setAddingSkills(prev => ({ ...prev, [skillName]: 'error' }));
      setTimeout(() => {
        setAddingSkills(prev => ({ ...prev, [skillName]: undefined }));
      }, 3000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f4] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-[#d4e510] font-bold">
            <Sparkles className="w-6 h-6 animate-spin" />
            <span>Loading your personalized learning dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f4] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-slate-400">{error}</p>
            <button onClick={fetchDashboardData} className="btn-accent text-sm">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const d = dashboardData;
  const hasProfile = d?.hasProfile;
  const kpis = d?.kpis;
  const skillProfile = d?.skillProfile || [];
  const learningProgress = d?.learningProgress;
  const skillsToStrengthen = d?.skillsToStrengthen || [];
  const learningGoal = d?.learningGoal;
  const recentAssessments = d?.assessmentResults || [];

  // Prepare radar chart data from skill profile
  const radarData = skillProfile.slice(0, 8).map(s => ({
    subject: s.skillName.length > 12 ? s.skillName.substring(0, 12) + '…' : s.skillName,
    fullName: s.skillName,
    proficiency: s.proficiency || 0
  }));

  // Progress bar chart data
  const progressBarData = learningProgress ? [
    { name: 'Completed', count: learningProgress.completed.length, fill: '#22c55e' },
    { name: 'In Progress', count: learningProgress.inProgress.length, fill: '#d4e510' },
    { name: 'Upcoming', count: learningProgress.upcoming.length, fill: '#334155' }
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f4] flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-x-hidden">

          {/* ───── Incomplete Profile Banner ───── */}
          {!hasProfile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card p-8 sm:p-12 rounded-2xl text-center space-y-4"
              style={{ borderColor: 'rgba(212, 229, 16, 0.2)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#d4e510]/10 text-[#d4e510] flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Your Personalized Learning Path Isn't Ready Yet
              </h2>
              <p className="text-xs sm:text-sm text-[#78716c] max-w-lg mx-auto leading-relaxed">
                Complete your profile with your current skills, experience, and learning goal so our AI can analyze your skill gaps and generate your custom learning path.
              </p>
              <div className="pt-2">
                <Link
                  to="/onboarding"
                  className="btn-accent inline-flex items-center gap-2"
                >
                  <span>Complete Profile Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >

              {/* ═══════════ SECTION 1: YOUR LEARNING JOURNEY ═══════════ */}
              <motion.div
                variants={cardVariants}
                className="surface-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 label-muted text-[#d4e510] mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Your Learning Journey</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {learningGoal || 'No learning goal selected'}
                  </h1>
                  {d?.learningGoalDescription && (
                    <p className="text-xs text-[#78716c] mt-1 max-w-xl">
                      {d.learningGoalDescription}
                    </p>
                  )}
                  {!learningGoal && (
                    <p className="text-xs text-[#78716c] mt-1">
                      Set a learning goal in your profile to generate your personalized path.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {learningGoal && (
                    <Link
                      to="/path"
                      className="btn-accent text-xs flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Continue My Path</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="btn-ghost text-xs flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>My Skills</span>
                  </Link>
                </div>
              </motion.div>


              {/* ═══════════ SECTION 2: LEARNING OVERVIEW KPIs ═══════════ */}
              <div>
                <h2 className="label-muted text-[#d4e510] mb-3 px-1">Learning Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

                  {/* Skills Identified */}
                  <motion.div variants={cardVariants} className="surface-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-muted">Skills Identified</span>
                      <Target className="w-4 h-4 text-[#d4e510]" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {kpis?.skillsIdentified ?? 0}
                    </div>
                    <div className="text-[10px] text-[#78716c]">
                      {kpis?.skillsIdentified > 0 ? 'From profile, resume & assessments' : 'No skills added yet'}
                    </div>
                  </motion.div>

                  {/* Skills Verified */}
                  <motion.div variants={cardVariants} className="surface-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-muted">Skills Verified</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {kpis?.skillsVerified ?? 0}
                    </div>
                    <div className="text-[10px] text-[#78716c]">
                      {kpis?.skillsVerified > 0 ? 'Verified through assessment' : 'Not assessed'}
                    </div>
                  </motion.div>

                  {/* Path Progress */}
                  <motion.div variants={cardVariants} className="surface-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-muted">Path Progress</span>
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    {kpis?.pathProgress?.total > 0 ? (
                      <>
                        <div className="text-2xl font-black text-white">
                          {kpis.pathProgress.percentage}%
                        </div>
                        <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${kpis.pathProgress.percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="bg-cyan-400 h-full rounded-full"
                          />
                        </div>
                        <div className="text-[10px] text-[#78716c]">
                          {kpis.pathProgress.completed} / {kpis.pathProgress.total} nodes
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-black text-white">—</div>
                        <div className="text-[10px] text-[#78716c]">No path generated yet</div>
                      </>
                    )}
                  </motion.div>

                  {/* Skills to Strengthen */}
                  <motion.div variants={cardVariants} className="surface-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-muted">To Strengthen</span>
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {kpis?.skillsToStrengthen ?? 0}
                    </div>
                    <div className="text-[10px] text-[#78716c]">
                      {kpis?.skillsToStrengthen > 0 ? 'Skill gaps not yet in path' : 'No gaps identified'}
                    </div>
                  </motion.div>

                  {/* Assessments Completed */}
                  <motion.div variants={cardVariants} className="surface-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-muted">Assessments</span>
                      <Award className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {kpis?.assessmentsCompleted ?? 0}
                    </div>
                    <div className="text-[10px] text-[#78716c]">
                      {kpis?.assessmentsCompleted > 0 ? 'Completed' : 'No assessments completed'}
                    </div>
                  </motion.div>

                  {/* Learning Streak */}
                  <motion.div variants={cardVariants} className="surface-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-muted">Streak</span>
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    {kpis?.learningStreak ? (
                      <>
                        <div className="text-2xl font-black text-white">
                          {kpis.learningStreak} <span className="text-sm font-bold text-[#78716c]">days</span>
                        </div>
                        <div className="text-[10px] text-[#78716c]">Active learning streak</div>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-[#78716c]">—</div>
                        <div className="text-[10px] text-[#78716c]">Start learning to build your streak</div>
                      </>
                    )}
                  </motion.div>

                </div>
              </div>


              {/* ═══════════ SECTION 3: SKILL PROFILE + LEARNING PROGRESS ═══════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* YOUR SKILL PROFILE — Radar Chart */}
                <motion.div variants={cardVariants} className="surface-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-lg text-white">Your Skill Profile</h3>
                      <p className="text-xs text-[#78716c]">Proficiency levels for your current skills</p>
                    </div>
                    <Link to="/profile" className="text-xs font-bold text-[#d4e510] hover:underline">
                      Full Profile →
                    </Link>
                  </div>

                  {skillProfile.length > 0 ? (
                    <>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#262626" />
                            <PolarAngleAxis
                              dataKey="subject"
                              stroke="#78716c"
                              tick={{ fontSize: 10, fill: '#a8a29e' }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#333" tick={false} />
                            <Radar
                              name="Proficiency"
                              dataKey="proficiency"
                              stroke="#d4e510"
                              fill="#d4e510"
                              fillOpacity={0.2}
                              strokeWidth={2}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Skill list below chart */}
                      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                        {skillProfile.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedSkill(selectedSkill?.skillName === s.skillName ? null : s)}
                            className="w-full text-left p-3 rounded-xl bg-[#141414] border border-white/[0.04] hover:border-[#d4e510]/20 transition"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-white">{s.skillName}</span>
                              <span className="text-xs font-bold text-[#d4e510]">{s.proficiency}%</span>
                            </div>
                            <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.proficiency}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                                className="bg-gradient-to-r from-[#d4e510] to-emerald-400 h-full rounded-full"
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#78716c]">
                              <span>{s.level}</span>
                              <span>•</span>
                              <span>{s.source}</span>
                              {s.isInPath && (
                                <>
                                  <span>•</span>
                                  <span className="text-cyan-400">In Path</span>
                                </>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <Target className="w-8 h-8 text-[#333] mx-auto" />
                        <p className="text-xs text-[#78716c]">No skills added yet</p>
                        <Link to="/profile" className="text-xs font-bold text-[#d4e510] hover:underline">
                          Add skills to your profile →
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* YOUR LEARNING PROGRESS */}
                <motion.div variants={cardVariants} className="surface-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-lg text-white">Your Learning Progress</h3>
                      <p className="text-xs text-[#78716c]">Track your path completion</p>
                    </div>
                    <Link to="/path" className="text-xs font-bold text-[#d4e510] hover:underline">
                      View Path →
                    </Link>
                  </div>

                  {learningProgress ? (
                    <div className="space-y-6">
                      {/* Progress bars */}
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressBarData} layout="vertical" barSize={28}>
                            <XAxis type="number" stroke="#78716c" tick={{ fontSize: 11 }} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              stroke="#78716c"
                              tick={{ fontSize: 12, fill: '#a8a29e' }}
                              width={90}
                            />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', borderRadius: '10px', fontSize: '12px' }}
                              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                              {progressBarData.map((entry, idx) => (
                                <Cell key={idx} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Current & Next node */}
                      <div className="space-y-3">
                        {learningProgress.currentNode && (
                          <div className="p-4 rounded-xl bg-[#d4e510]/5 border border-[#d4e510]/15">
                            <div className="label-muted text-[#d4e510] mb-1">Currently Learning</div>
                            <div className="font-bold text-sm text-white">{learningProgress.currentNode.topic}</div>
                            <div className="text-[10px] text-[#78716c] mt-1 flex items-center gap-2">
                              <span>{learningProgress.currentNode.category}</span>
                              <span>•</span>
                              <span>{learningProgress.currentNode.difficulty}</span>
                              <span>•</span>
                              <span>~{learningProgress.currentNode.estimatedHours}h</span>
                            </div>
                          </div>
                        )}

                        {learningProgress.nextNode && (
                          <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.04]">
                            <div className="label-muted mb-1">Up Next</div>
                            <div className="font-bold text-sm text-[#a8a29e]">{learningProgress.nextNode.topic}</div>
                            <div className="text-[10px] text-[#78716c] mt-1">
                              {learningProgress.nextNode.category} • {learningProgress.nextNode.difficulty}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <MapPin className="w-8 h-8 text-[#333] mx-auto" />
                        <p className="text-xs text-[#78716c]">No learning path generated yet</p>
                        <Link to="/onboarding" className="text-xs font-bold text-[#d4e510] hover:underline">
                          Set a learning goal to get started →
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>


              {/* ═══════════ SECTION 4: SKILLS TO STRENGTHEN ═══════════ */}
              {skillsToStrengthen.length > 0 && (
                <motion.div variants={cardVariants}>
                  <h2 className="label-muted text-[#d4e510] mb-3 px-1">Skills to Strengthen</h2>
                  <p className="text-xs text-[#78716c] mb-4 px-1">
                    Skills identified from your {learningGoal || 'learning'} goal that are not yet covered in your path.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillsToStrengthen.map((skill, idx) => {
                      const addState = addingSkills[skill.skillName];
                      const isAdded = addState === 'added';
                      const isLoading = addState === 'loading';
                      const isError = addState === 'error';

                      return (
                        <motion.div
                          key={skill.skillName}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: isAdded ? 0.5 : 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`surface-card p-5 rounded-2xl space-y-4 transition-all ${isAdded ? 'border-emerald-500/20' : ''}`}
                        >
                          <div>
                            <h4 className="font-black text-base text-white">{skill.skillName}</h4>
                            <div className="text-[10px] text-[#78716c] mt-1 flex items-center gap-1.5">
                              <span>Current level:</span>
                              <span className="font-bold text-[#a8a29e]">{skill.currentLevel}</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#78716c] leading-relaxed">
                            {skill.whyItMatters}
                          </p>

                          {skill.helpsLearn && skill.helpsLearn.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider">Helps you learn:</div>
                              <div className="flex flex-wrap gap-1.5">
                                {skill.helpsLearn.map((tag, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#1a1a1a] text-[#a8a29e] border border-white/[0.04]">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => handleAddToPath(skill.skillName)}
                            disabled={isAdded || isLoading}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                                : isLoading
                                ? 'bg-[#1a1a1a] text-[#78716c] border border-white/[0.04] cursor-wait'
                                : isError
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-[#141414] hover:bg-[#1a1a1a] text-[#f5f5f4] border border-white/[0.06] hover:border-[#d4e510]/30'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added to My Path</span>
                              </>
                            ) : isLoading ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                <span>Adding...</span>
                              </>
                            ) : isError ? (
                              <span>Failed — Try Again</span>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to My Path</span>
                                <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}


              {/* ═══════════ SECTION 5: CURRENT PATH + ASSESSMENTS ═══════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* YOUR CURRENT PATH */}
                {learningProgress && (learningProgress.currentNode || learningProgress.completed.length > 0) && (
                  <motion.div variants={cardVariants} className="surface-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-lg text-white">Your Current Path</h3>
                        <p className="text-xs text-[#78716c]">What to focus on next</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Recent completions */}
                      {learningProgress.completed.slice(-2).map((node, idx) => (
                        <Link key={node.id} to={`/path/module/${node.id}`} className="block">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/[0.03] hover:border-emerald-500/30 transition">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div className="flex-1">
                              <div className="text-xs font-bold text-[#a8a29e]">{node.topic}</div>
                              <div className="text-[10px] text-[#78716c]">{node.category}</div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Done ✓</span>
                          </div>
                        </Link>
                      ))}

                      {/* Current node */}
                      {learningProgress.currentNode && (
                        <Link to={`/path/module/${learningProgress.currentNode.id}`} className="block">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#d4e510]/5 border border-[#d4e510]/15 hover:border-[#d4e510]/30 transition">
                            <div className="w-5 h-5 rounded-full bg-[#d4e510]/20 border-2 border-[#d4e510] shrink-0 flex items-center justify-center">
                              <ChevronRight className="w-3 h-3 text-[#d4e510]" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-white">{learningProgress.currentNode.topic}</div>
                              <div className="text-[10px] text-[#78716c]">{learningProgress.currentNode.category} • ~{learningProgress.currentNode.estimatedHours}h</div>
                            </div>
                            <span className="text-[10px] font-bold text-[#d4e510]">Current →</span>
                          </div>
                        </Link>
                      )}

                      {/* Next upcoming */}
                      {learningProgress.nextNode && (
                        <Link to={`/path/module/${learningProgress.nextNode.id}`} className="block">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-white/[0.03] hover:border-white/10 transition opacity-80">
                            <div className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#333] shrink-0" />
                            <div className="flex-1">
                              <div className="text-xs font-bold text-[#78716c]">{learningProgress.nextNode.topic}</div>
                              <div className="text-[10px] text-[#555]">{learningProgress.nextNode.category}</div>
                            </div>
                            <span className="text-[10px] text-[#555]">Next →</span>
                          </div>
                        </Link>
                      )}
                    </div>

                    <Link
                      to="/path"
                      className="block w-full mt-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] text-xs font-bold text-[#a8a29e] text-center transition"
                    >
                      View Full Learning Path →
                    </Link>
                  </motion.div>
                )}

                {/* ASSESSMENTS */}
                <motion.div variants={cardVariants} className="surface-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-lg text-white">Assessments</h3>
                      <p className="text-xs text-[#78716c]">Verify your skills through testing</p>
                    </div>
                    <Link to="/assessment" className="text-xs font-bold text-[#d4e510] hover:underline">
                      All Assessments →
                    </Link>
                  </div>

                  {skillProfile.length > 0 ? (
                    <div className="space-y-3">
                      {/* Skills that need assessment */}
                      {skillProfile
                        .filter(s => s.status !== 'Verified')
                        .slice(0, 4)
                        .map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0a] border border-white/[0.03]">
                            <div className="flex items-center gap-2.5">
                              {s.status === 'Developing' ? (
                                <Activity className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-[#555]" />
                              )}
                              <div>
                                <div className="text-xs font-bold text-white">{s.skillName}</div>
                                <div className="text-[9px] text-[#78716c]">{s.status || 'Not Assessed'}</div>
                              </div>
                            </div>
                            <Link
                              to="/assessment"
                              className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] text-[10px] font-bold text-[#a8a29e] transition"
                            >
                              Take Assessment
                            </Link>
                          </div>
                        ))}

                      {/* Recent results */}
                      {recentAssessments.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-white/[0.04]">
                          <div className="label-muted mb-2">Recent Results</div>
                          {recentAssessments.slice(0, 3).map((ar, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-xs text-[#a8a29e]">{ar.skill}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{ar.score}%</span>
                                <span className="text-[10px] text-[#78716c]">{ar.proficiencyLevel}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <FileText className="w-8 h-8 text-[#333] mx-auto" />
                        <p className="text-xs text-[#78716c]">Add skills to take assessments</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

            </motion.div>
          )}

        </main>
      </div>

      {/* ═══════════ SKILL DETAIL PANEL (SLIDE-OUT) ═══════════ */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="surface-card max-w-md w-full p-6 rounded-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl text-white">{selectedSkill.skillName}</h3>
                <button onClick={() => setSelectedSkill(null)} className="text-[#78716c] hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#0a0a0a] border border-white/[0.03]">
                    <div className="label-muted mb-1">Proficiency</div>
                    <div className="text-lg font-black text-[#d4e510]">{selectedSkill.proficiency}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a0a0a] border border-white/[0.03]">
                    <div className="label-muted mb-1">Level</div>
                    <div className="text-lg font-black text-white">{selectedSkill.level}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#78716c]">Assessment Status</span>
                    <span className={`font-bold ${selectedSkill.status === 'Verified' ? 'text-emerald-400' : selectedSkill.status === 'Developing' ? 'text-cyan-400' : 'text-[#78716c]'}`}>
                      {selectedSkill.assessmentScore ? `${selectedSkill.assessmentScore}% — ${selectedSkill.assessmentLevel}` : selectedSkill.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#78716c]">Source</span>
                    <span className="font-bold text-[#a8a29e]">{selectedSkill.source}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#78716c]">In Learning Path</span>
                    <span className={`font-bold ${selectedSkill.isInPath ? 'text-cyan-400' : 'text-[#78716c]'}`}>
                      {selectedSkill.isInPath ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.04]">
                  <div className="label-muted mb-2">Recommended Action</div>
                  {selectedSkill.status !== 'Verified' ? (
                    <Link
                      to="/assessment"
                      onClick={() => setSelectedSkill(null)}
                      className="btn-accent w-full text-center block text-sm"
                    >
                      Take Assessment →
                    </Link>
                  ) : (
                    <p className="text-xs text-emerald-400 font-bold">✓ Skill verified through assessment</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
