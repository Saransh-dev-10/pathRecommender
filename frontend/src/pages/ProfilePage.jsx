import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axiosClient';
import { 
  Sparkles, User, Award, CheckCircle2, AlertTriangle, Layers, 
  Edit3, Save, X, Plus, Upload, BookOpen, Check, Trash2, ArrowRight,
  ShieldAlert, RefreshCw, BarChart2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import SkillAutocompleteInput from '../components/SkillAutocompleteInput';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const levelProgress = {
  'Beginner': 30,
  'Intermediate': 60,
  'Advanced': 85,
  'Expert': 95,
  'Not Assessed': 0
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Verified':
      return <CheckCircle2 className="w-4 h-4 text-lime-400" />;
    case 'Developing':
      return <Layers className="w-4 h-4 text-cyan-400" />;
    default:
      return <ShieldAlert className="w-4 h-4 text-slate-500" />;
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Verified':
      return 'bg-lime-400/10 text-lime-400 border border-lime-400/20';
    case 'Developing':
      return 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20';
    default:
      return 'bg-slate-800 text-slate-400 border border-slate-700';
  }
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [resumeForm, setResumeForm] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [addedSkillsNotify, setAddedSkillsNotify] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/profile');
      setProfileData(data);
      // Clone profile fields to editable form
      if (data.profile) {
        setResumeForm({
          education: data.profile.education || { degree: '', branch: '', graduationYear: '', college: '' },
          projects: data.profile.projects || [],
          certifications: data.profile.certifications || [],
          skills: data.profile.skills || [],
          learningGoal: data.profile.learningGoal || '',
          experienceLevel: data.profile.experienceLevel || 'Beginner'
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualSkill = async (skillPayload) => {
    try {
      await API.post('/skills', {
        skill: skillPayload.skillName,
        level: skillPayload.declaredLevel || skillPayload.level
      });
      await fetchProfile();
      setIsAddingSkill(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add skill.';
      throw new Error(msg);
    }
  };

  const handleDeleteSkill = async (skillName) => {
    if (!window.confirm(`Are you sure you want to remove "${skillName}" from your profile?`)) return;
    try {
      await API.delete(`/skills/${encodeURIComponent(skillName)}`);
      await fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove skill.');
    }
  };

  // Upload a resume to automatically extract data
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await API.post('/onboarding/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.extractedData) {
        const ext = data.extractedData;
        const currentProfile = profileData.profile || {};

        // Merge existing and new extracted skills
        const existingSkillNames = new Set((currentProfile.skills || []).map(s => s.skillName.toLowerCase()));
        const newSkills = [...(currentProfile.skills || [])];

        (ext.technicalSkills || []).forEach(s => {
          const name = s.skillName || s;
          if (name && !existingSkillNames.has(name.toLowerCase())) {
            newSkills.push({
              skillName: name,
              category: s.category || 'General',
              level: 'Intermediate',
              source: 'Resume',
              status: 'Not Assessed',
              lastUpdated: new Date()
            });
          }
        });

        // Save immediately to DB
        const updatedPayload = {
          ...currentProfile,
          education: ext.education || currentProfile.education,
          experienceLevel: ext.experienceLevel || currentProfile.experienceLevel,
          skills: newSkills,
          projects: ext.projects || currentProfile.projects,
          certifications: ext.certifications || currentProfile.certifications,
          resumeFileName: data.fileName || 'Uploaded_Resume.pdf'
        };

        await API.put('/profile', updatedPayload);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveResumeData = async () => {
    try {
      const currentProfile = profileData.profile || {};
      const updatedPayload = {
        ...currentProfile,
        education: resumeForm.education,
        projects: resumeForm.projects,
        certifications: resumeForm.certifications,
        skills: resumeForm.skills,
        learningGoal: resumeForm.learningGoal,
        experienceLevel: resumeForm.experienceLevel
      };
      await API.put('/profile', updatedPayload);
      setIsEditingResume(false);
      fetchProfile();
    } catch (err) {
      alert("Failed to update profile details.");
    }
  };

  const handleAddSkillToPath = async (skillName) => {
    // Prevent duplicate clicks
    if (addedSkillsNotify[skillName] === 'loading' || addedSkillsNotify[skillName] === 'added') return;

    setAddedSkillsNotify(prev => ({ ...prev, [skillName]: 'loading' }));
    try {
      // Call the add-to-path endpoint which adds a learning node AND updates profile skills
      const { data } = await API.post('/dashboard/add-to-path', { skillName });

      if (data.alreadyExists) {
        // Skill already in path — mark as added
        setAddedSkillsNotify(prev => ({ ...prev, [skillName]: 'added' }));
      } else {
        setAddedSkillsNotify(prev => ({ ...prev, [skillName]: 'added' }));
      }

      // Re-fetch profile to get updated skill analysis
      fetchProfile();
    } catch (err) {
      console.error('Add to path error:', err);
      setAddedSkillsNotify(prev => ({ ...prev, [skillName]: 'error' }));
      setTimeout(() => {
        setAddedSkillsNotify(prev => ({ ...prev, [skillName]: undefined }));
      }, 3000);
    }
  };

  // Dynamic compatibility calculations based on actual user data
  const calculateCompatibility = (skills) => {
    const skillNames = (skills || []).map(s => s.skillName.toLowerCase().trim().replace(/[.\s\-_]/g, ''));
    
    const domains = [
      {
        domain: 'Full Stack Development',
        reqs: ['react', 'javascript', 'node', 'nodejs', 'mongodb', 'express', 'html', 'css', 'htmlcss']
      },
      {
        domain: 'Frontend Development',
        reqs: ['react', 'javascript', 'html', 'css', 'htmlcss', 'typescript', 'tailwind']
      },
      {
        domain: 'Backend Development',
        reqs: ['node', 'nodejs', 'express', 'mongodb', 'javascript', 'sql', 'postgres', 'postgresql']
      },
      {
        domain: 'DevOps & Cloud',
        reqs: ['docker', 'aws', 'kubernetes', 'linux', 'cicd']
      }
    ];

    return domains.map(d => {
      const matched = d.reqs.filter(r => skillNames.includes(r));
      // Baseline 15%, scaled up to 100% depending on matches
      const score = Math.max(15, Math.round((matched.length / Math.min(d.reqs.length, 4)) * 100));
      return {
        domain: d.domain,
        score: Math.min(100, score)
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-lime-400 font-bold">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Skills Profile...</span>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileData?.profile || {};
  const skillAnalysis = profileData?.skillAnalysis || {};
  const userSkills = profile.skills || [];
  const domainCompatibility = calculateCompatibility(userSkills);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Hero Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">My Skills</h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Understand what you know, validate your skills via evaluations, and dynamically adapt your learning path to close remaining gaps.
            </p>
          </div>

          {/* Goal & Statistics Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-widest text-lime-400 uppercase">Your Learning Goal</span>
              <h2 className="text-2xl font-black text-white">{profile.learningGoal || 'Not Set'}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                We've built a custom learning path containing <span className="text-lime-400 font-bold">{userSkills.length} skills</span> matching your profile.
              </p>
            </div>
            {profile.learningGoal && (
              <Link 
                to="/path" 
                className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black tracking-wider uppercase transition flex items-center gap-2 shadow-lg shadow-lime-400/20"
              >
                <span>View Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Core Content Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Skill list & proficiency */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Skill Cards Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2 uppercase tracking-wider">
                    <BookOpen className="w-5 h-5 text-lime-400" />
                    <span>Your Skills ({userSkills.length})</span>
                  </h3>
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>

                {userSkills.length === 0 ? (
                  <div className="border border-dashed border-slate-850 bg-slate-900/40 p-8 rounded-3xl text-center space-y-4">
                    <p className="text-slate-400 text-xs">
                      No skills added yet. Click <strong>"Add Skill"</strong> above or upload your resume below to construct your verified learning profile.
                    </p>
                    <button
                      onClick={() => setIsAddingSkill(true)}
                      className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold transition inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Your First Skill</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userSkills.map((s, idx) => (
                      <motion.div 
                        key={idx}
                        variants={itemVariants}
                        className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition relative group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-extrabold text-base text-white tracking-wide">{s.skillName}</h4>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">{s.category || 'General'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(s.status)}`}>
                              {s.status || 'Not Assessed'}
                            </span>
                            <button
                              onClick={() => handleDeleteSkill(s.skillName)}
                              title={`Remove ${s.skillName}`}
                              className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition opacity-60 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Proficiency Level and Custom Visual Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Proficiency:</span>
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span>{s.level || 'Not Assessed'}</span>
                              <span className="text-[10px] text-lime-400 font-extrabold">
                                ({levelProgress[s.level] || 0}%)
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${levelProgress[s.level] || 0}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="bg-lime-400 h-full rounded-full"
                            ></motion.div>
                          </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-850 pt-2.5">
                          <span>Source: <strong className="text-slate-400">{s.source || 'Profile'}</strong></span>
                          <span>Last evaluated: <strong className="text-slate-400">{s.lastUpdated ? new Date(s.lastUpdated).toLocaleDateString() : 'N/A'}</strong></span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resume Analysis Widget */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2 uppercase tracking-wider">
                  <Upload className="w-5 h-5 text-lime-400" />
                  <span>Resume Analysis Data</span>
                </h3>

                {profile.resumeFileName ? (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-lime-400/5 border border-lime-400/20 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-lime-400 font-black">RESUME DETECTED ✓</div>
                        <div className="text-sm font-bold text-white">{profile.resumeFileName}</div>
                      </div>
                      <button 
                        onClick={() => setIsEditingResume(true)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-white transition flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-lime-400" />
                        <span>Review Resume Data</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Education</div>
                        <div className="text-xs font-bold text-slate-200 truncate">
                          {profile.education?.degree || 'N/A'}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Skills Detected</div>
                        <div className="text-xs font-bold text-slate-200">
                          {userSkills.filter(s => s.source === 'Resume').length} Skills
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Projects Found</div>
                        <div className="text-xs font-bold text-slate-200">
                          {(profile.projects || []).length} Projects
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Certifications</div>
                        <div className="text-xs font-bold text-slate-200">
                          {(profile.certifications || []).length} Certs
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-800 p-8 rounded-3xl text-center space-y-4 bg-slate-950/20">
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      No resume uploaded yet. Upload a resume file to automatically scan, extract details, and suggest existing skills.
                    </p>
                    <label className="inline-block cursor-pointer px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-white transition">
                      {uploadingResume ? 'Scanning Resume...' : 'Upload Resume (PDF/TXT)'}
                      <input 
                        type="file" 
                        accept=".pdf,.txt" 
                        onChange={handleResumeUpload} 
                        className="hidden" 
                        disabled={uploadingResume} 
                      />
                    </label>
                  </div>
                )}
              </div>

            </div>

            {/* Right Col: Quiz evaluation, domain score, strengthen skills */}
            <div className="space-y-8">
              
              {/* Test Knowledge Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2 uppercase tracking-wider">
                  <Award className="w-5 h-5 text-lime-400" />
                  <span>Test Your Knowledge</span>
                </h3>
                
                {userSkills.length === 0 ? (
                  <p className="text-slate-500 text-xs">Add skills to start testing yourself.</p>
                ) : (
                  <div className="space-y-3.5">
                    {userSkills.slice(0, 4).map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850">
                        <div className="flex items-center gap-2.5">
                          {getStatusIcon(s.status)}
                          <div>
                            <div className="text-xs font-bold text-slate-100">{s.skillName}</div>
                            <div className="text-[9px] text-slate-500">{s.level || 'Not Assessed'}</div>
                          </div>
                        </div>
                        <Link 
                          to="/assessment"
                          className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-[10px] font-bold text-slate-200 transition"
                        >
                          Take Quiz
                        </Link>
                      </div>
                    ))}
                    {userSkills.length > 4 && (
                      <Link 
                        to="/assessment" 
                        className="block text-center text-xs text-lime-400 hover:underline pt-2 font-bold"
                      >
                        View All Assessments ({userSkills.length}) →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Skills to Strengthen */}
              {skillAnalysis.missingSkills && skillAnalysis.missingSkills.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                  <div>
                    <h3 className="font-extrabold text-lg text-white flex items-center gap-2 uppercase tracking-wider">
                      <Sparkles className="w-5 h-5 text-lime-400" />
                      <span>Skills To Strengthen</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      Skills identified from your {profile.learningGoal || 'learning'} goal that are not yet covered in your path.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {skillAnalysis.missingSkills.slice(0, 5).map((skill, idx) => {
                      const addState = addedSkillsNotify[skill];
                      const isAdded = addState === 'added';
                      const isLoading = addState === 'loading';
                      const isError = addState === 'error';

                      return (
                        <motion.div 
                          key={idx} 
                          variants={itemVariants}
                          className={`p-4 bg-slate-950 border rounded-2xl space-y-3 transition-all ${
                            isAdded ? 'border-lime-400/20 opacity-60' : 'border-slate-850'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-extrabold text-slate-200">{skill}</div>
                            <div className="text-[10px] text-slate-600 mt-0.5">Current level: Not assessed</div>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                              {skill} strengthens your capabilities for your {profile.learningGoal || 'learning'} path.
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddSkillToPath(skill)}
                            disabled={isAdded || isLoading}
                            className={`w-full py-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                              isAdded
                                ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20 cursor-default'
                                : isLoading
                                ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-wait'
                                : isError
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-lime-400" />
                                <span className="text-lime-400">Added to My Path ✓</span>
                              </>
                            ) : isLoading ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
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
                </div>
              )}

              {/* Domain Compatibility */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2 uppercase tracking-wider">
                  <BarChart2 className="w-5 h-5 text-lime-400" />
                  <span>Domain Compatibility</span>
                </h3>

                <div className="space-y-4">
                  {domainCompatibility.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">{item.domain}</span>
                        <span className="text-lime-400 font-extrabold">{item.score}% Match</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </main>
      </div>

      {/* Review Resume Data Modal */}
      {isEditingResume && resumeForm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 max-w-2xl w-full p-6 rounded-3xl border border-slate-800 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-xl text-white uppercase tracking-wider">Review & Edit Profile Data</h3>
              <button onClick={() => setIsEditingResume(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              
              {/* Learning Goal & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Learning Goal</label>
                  <input 
                    type="text" 
                    value={resumeForm.learningGoal} 
                    onChange={(e) => setResumeForm({ ...resumeForm, learningGoal: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:border-lime-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Experience Level</label>
                  <select 
                    value={resumeForm.experienceLevel} 
                    onChange={(e) => setResumeForm({ ...resumeForm, experienceLevel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white focus:border-lime-400 outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Experienced">Experienced</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-lime-400 uppercase tracking-widest">Education Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Degree</label>
                    <input 
                      type="text" 
                      value={resumeForm.education.degree} 
                      onChange={(e) => setResumeForm({
                        ...resumeForm,
                        education: { ...resumeForm.education, degree: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Branch</label>
                    <input 
                      type="text" 
                      value={resumeForm.education.branch} 
                      onChange={(e) => setResumeForm({
                        ...resumeForm,
                        education: { ...resumeForm.education, branch: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">College/University</label>
                    <input 
                      type="text" 
                      value={resumeForm.education.college} 
                      onChange={(e) => setResumeForm({
                        ...resumeForm,
                        education: { ...resumeForm.education, college: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Graduation Year</label>
                    <input 
                      type="number" 
                      value={resumeForm.education.graduationYear || ''} 
                      onChange={(e) => setResumeForm({
                        ...resumeForm,
                        education: { ...resumeForm.education, graduationYear: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-lime-400 uppercase tracking-widest">Active Skills</h4>
                  <button 
                    onClick={() => {
                      setResumeForm({
                        ...resumeForm,
                        skills: [
                          ...resumeForm.skills,
                          { skillName: '', level: 'Intermediate', source: 'Profile', status: 'Not Assessed', lastUpdated: new Date() }
                        ]
                      });
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-lime-400 hover:text-lime-300 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto border border-slate-850 p-3 rounded-2xl bg-slate-950">
                  {resumeForm.skills.map((sk, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text"
                        placeholder="Skill Name"
                        value={sk.skillName}
                        onChange={(e) => {
                          const list = [...resumeForm.skills];
                          list[index].skillName = e.target.value;
                          setResumeForm({ ...resumeForm, skills: list });
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none"
                      />
                      <select
                        value={sk.level}
                        onChange={(e) => {
                          const list = [...resumeForm.skills];
                          list[index].level = e.target.value;
                          setResumeForm({ ...resumeForm, skills: list });
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button 
                        onClick={() => {
                          const list = resumeForm.skills.filter((_, idx) => idx !== index);
                          setResumeForm({ ...resumeForm, skills: list });
                        }}
                        className="p-2 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                onClick={() => setIsEditingResume(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveResumeData}
                className="px-6 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black tracking-wider uppercase shadow-lg shadow-lime-400/20 transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> 
                <span>Save Profile</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Skill Modal Dialog */}
      <AnimatePresence>
        {isAddingSkill && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Add a Skill</h3>
                    <p className="text-xs text-slate-400">Search recognized technical & professional skills</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddingSkill(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Autocomplete Input Component */}
              <SkillAutocompleteInput
                onAddSkill={handleAddManualSkill}
                existingSkills={userSkills}
                autoFocus={true}
                showProficiencyPicker={true}
                placeholder="Search skills (e.g. JavaScript, PostgreSQL, Docker)..."
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfilePage;
