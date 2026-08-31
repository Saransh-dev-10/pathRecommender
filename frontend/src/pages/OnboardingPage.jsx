import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosClient';
import { Upload, Sparkles, Check, ArrowRight, ArrowLeft, Plus, Trash2, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillAutocompleteInput from '../components/SkillAutocompleteInput';

const LEARNING_GOALS = [
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'React',
  'Machine Learning',
  'Data Structures',
  'Python',
  'DevOps',
  'System Design',
];

const TIME_OPTIONS = [
  { label: '30 min/day', minutes: 30, weeklyHours: 3.5 },
  { label: '1 hour/day', minutes: 60, weeklyHours: 7 },
  { label: '2 hours/day', minutes: 120, weeklyHours: 14 },
  { label: '3+ hours/day', minutes: 180, weeklyHours: 21 },
];

const OnboardingPage = () => {
  const { updateOnboardingStatus } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Step 1: Skills
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  // Step 2: Learning Goal
  const [learningGoal, setLearningGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  // Step 3: Preferences
  const [selectedTime, setSelectedTime] = useState(TIME_OPTIONS[1]);
  const [difficultyPreference, setDifficultyPreference] = useState('Intermediate');
  const [theoryVsPractice, setTheoryVsPractice] = useState('Balanced');
  const [projectBased, setProjectBased] = useState(true);

  // Step 4: Resume/Projects
  const [parsingResume, setParsingResume] = useState(false);
  const [resumeNotice, setResumeNotice] = useState('');
  const [projects, setProjects] = useState([]);

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { skillName: newSkillName.trim(), level: newSkillLevel, experienceYears: 0 }]);
    setNewSkillName('');
  };

  const removeSkill = (idx) => setSkills(skills.filter((_, i) => i !== idx));

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setParsingResume(true);
    setResumeNotice('');
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await API.post('/onboarding/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.extractedData) {
        const ext = data.extractedData;
        if (ext.technicalSkills && ext.technicalSkills.length > 0) {
          setSkills(prev => [...prev, ...ext.technicalSkills.map(s => ({
            skillName: s.skillName || s, level: 'Intermediate', experienceYears: 0
          }))]);
        }
        if (ext.projects && ext.projects.length > 0) setProjects(ext.projects);
        setResumeNotice(`Extracted skills from "${data.fileName}". Review in Step 1.`);
      }
    } catch (err) {
      setResumeNotice('Could not fully parse resume. Add skills manually.');
    } finally {
      setParsingResume(false);
    }
  };

  const handleSubmit = async () => {
    setGenerating(true);
    const generationSteps = [
      'Analyzing your existing knowledge...',
      'Identifying skill gaps...',
      'Mapping prerequisites...',
      'Building your learning sequence...',
      'Personalizing your path...'
    ];

    // Animate through generation steps
    for (let i = 0; i < generationSteps.length; i++) {
      setGenerationStep(i);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const finalGoal = learningGoal === 'custom' ? customGoal : learningGoal;
      await API.post('/onboarding/complete', {
        skills,
        learningGoal: finalGoal,
        dailyLearningMinutes: selectedTime.minutes,
        weeklyLearningHours: selectedTime.weeklyHours,
        difficultyPreference,
        theoryVsPractice,
        projectBased,
        projects
      });
      updateOnboardingStatus(true);
      setGenerationStep(generationSteps.length); // "ready" state
      await new Promise(r => setTimeout(r, 1200));
      navigate('/path');
    } catch (err) {
      console.error('Onboarding error:', err);
      setGenerating(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return skills.length > 0;
    if (step === 2) return learningGoal && (learningGoal !== 'custom' || customGoal.trim());
    return true;
  };

  const generationSteps = [
    'Analyzing your existing knowledge',
    'Identifying skill gaps',
    'Mapping prerequisites',
    'Building your learning sequence',
    'Personalizing your path'
  ];

  // AI Generation Screen
  if (generating) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          {generationStep < generationSteps.length ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-accent text-3xl mb-8">✦</div>
              <div className="space-y-4 text-left">
                {generationSteps.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= generationStep ? 1 : 0.3, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3"
                  >
                    {i < generationStep ? (
                      <Check className="w-5 h-5 text-accent shrink-0" />
                    ) : i === generationStep ? (
                      <Sparkles className="w-5 h-5 text-accent animate-pulse shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-surface-700 shrink-0" />
                    )}
                    <span className={`text-sm ${i <= generationStep ? 'text-surface-200' : 'text-surface-600'}`}>
                      {s}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-accent text-4xl mb-6">✦</div>
              <h2 className="heading-serif text-4xl text-surface-100 mb-3">Your path is ready.</h2>
              <p className="text-surface-400 text-sm">Redirecting to your learning path...</p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        
        {/* Step Indicator */}
        <div className="text-center mb-12">
          <div className="label-muted text-accent mb-6">Step {step} of 4</div>
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'w-12 bg-accent' : 'w-8 bg-surface-800'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Skills */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="heading-serif text-4xl sm:text-5xl text-surface-100 text-center mb-3">
                Let's start with
                <br />
                <span className="text-accent">what you already know.</span>
              </h1>
              <p className="text-surface-400 text-center mb-10 text-sm">
                Add the skills and technologies you're familiar with.
              </p>

              {/* Search & Add Validated Skill Component */}
              <div className="mb-6">
                <SkillAutocompleteInput
                  onAddSkill={(newSkill) => {
                    setSkills(prev => [...prev, {
                      skillName: newSkill.skillName,
                      level: newSkill.level,
                      category: newSkill.category,
                      experienceYears: 0
                    }]);
                  }}
                  existingSkills={skills}
                  showProficiencyPicker={true}
                  placeholder="Search recognized skills (e.g. JavaScript, React, Python, Docker)..."
                />
              </div>

              {/* Skills List */}
              {skills.length > 0 && (
                <div className="space-y-2 mb-8 max-h-64 overflow-y-auto">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                    Your Selected Skills ({skills.length})
                  </div>
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-800/80 border border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-surface-100">{skill.skillName}</span>
                        {skill.category && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-surface-900 text-surface-400 border border-white/[0.04]">
                            {skill.category}
                          </span>
                        )}
                        <span className="text-xs text-accent font-semibold ml-1">• {skill.level}</span>
                      </div>
                      <button onClick={() => removeSkill(idx)} className="text-surface-500 hover:text-red-400 p-1 transition">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {skills.length === 0 && (
                <div className="text-center py-8 text-surface-500 text-xs border border-dashed border-white/[0.06] rounded-2xl">
                  No skills added yet. Search and select a recognized skill above.
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Learning Goal */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="heading-serif text-4xl sm:text-5xl text-surface-100 text-center mb-3">
                What do you want
                <br />
                <span className="text-accent">to learn?</span>
              </h1>
              <p className="text-surface-400 text-center mb-10 text-sm">
                Choose a learning goal or type your own.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {LEARNING_GOALS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => setLearningGoal(goal)}
                    className={`px-4 py-3.5 rounded-xl text-sm font-medium transition text-left ${
                      learningGoal === goal
                        ? 'bg-accent text-surface-900 font-semibold'
                        : 'bg-surface-800 text-surface-300 border border-white/[0.06] hover:border-accent/30 hover:text-surface-100'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
                <button
                  onClick={() => setLearningGoal('custom')}
                  className={`px-4 py-3.5 rounded-xl text-sm font-medium transition text-left ${
                    learningGoal === 'custom'
                      ? 'bg-accent text-surface-900 font-semibold'
                      : 'bg-surface-800 text-surface-300 border border-white/[0.06] hover:border-accent/30'
                  }`}
                >
                  Custom goal...
                </button>
              </div>

              {learningGoal === 'custom' && (
                <input
                  type="text"
                  value={customGoal}
                  onChange={e => setCustomGoal(e.target.value)}
                  placeholder="e.g. I want to learn AI agents using Python"
                  className="w-full px-4 py-3 rounded-lg bg-surface-800 border border-white/[0.06] text-surface-100 text-sm placeholder:text-surface-500 focus:outline-none focus:border-accent/40 transition"
                />
              )}
            </motion.div>
          )}

          {/* Step 3: Learning Preferences */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="heading-serif text-4xl sm:text-5xl text-surface-100 text-center mb-3">
                How do you want
                <br />
                <span className="text-accent">to learn?</span>
              </h1>
              <p className="text-surface-400 text-center mb-10 text-sm">
                Help us personalize the pace and style of your path.
              </p>

              {/* Daily Time */}
              <div className="mb-8">
                <div className="label-muted mb-3">Daily learning time</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TIME_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedTime(opt)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                        selectedTime.label === opt.label
                          ? 'bg-accent text-surface-900'
                          : 'bg-surface-800 text-surface-300 border border-white/[0.06] hover:border-accent/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-8">
                <div className="label-muted mb-3">Preferred difficulty</div>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficultyPreference(d)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                        difficultyPreference === d
                          ? 'bg-accent text-surface-900'
                          : 'bg-surface-800 text-surface-300 border border-white/[0.06] hover:border-accent/30'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theory vs Practice */}
              <div className="mb-8">
                <div className="label-muted mb-3">Learning style</div>
                <div className="grid grid-cols-3 gap-2">
                  {['Theory', 'Balanced', 'Practice'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTheoryVsPractice(t)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                        theoryVsPractice === t
                          ? 'bg-accent text-surface-900'
                          : 'bg-surface-800 text-surface-300 border border-white/[0.06] hover:border-accent/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project-based */}
              <div>
                <button
                  onClick={() => setProjectBased(!projectBased)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left flex items-center justify-between transition ${
                    projectBased
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'bg-surface-800 text-surface-400 border border-white/[0.06]'
                  }`}
                >
                  <span>Include project-based learning</span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${projectBased ? 'bg-accent text-surface-900' : 'border border-surface-600'}`}>
                    {projectBased && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Resume/Projects */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="heading-serif text-4xl sm:text-5xl text-surface-100 text-center mb-3">
                Import your
                <br />
                <span className="text-accent">experience.</span>
              </h1>
              <p className="text-surface-400 text-center mb-10 text-sm">
                Optional — upload a resume or add past projects to improve your path.
              </p>

              {/* Resume Upload */}
              <div className="surface-card p-6 mb-6">
                <label className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-accent/30 transition">
                  <Upload className="w-8 h-8 text-surface-500 mb-3" />
                  <span className="text-sm text-surface-400">
                    {parsingResume ? 'Analyzing resume...' : 'Drop a PDF resume here, or click to browse'}
                  </span>
                  <input type="file" accept=".pdf,.txt" onChange={handleResumeUpload} className="hidden" />
                </label>
                {resumeNotice && (
                  <div className="mt-3 text-xs text-accent">{resumeNotice}</div>
                )}
              </div>

              {/* Extracted/Added Skills Count */}
              {skills.length > 0 && (
                <div className="surface-card p-4 mb-6 flex items-center justify-between">
                  <span className="text-sm text-surface-300">{skills.length} skills added</span>
                  <span className="text-xs text-surface-500">From Step 1 + Resume</span>
                </div>
              )}

              <p className="text-center text-xs text-surface-500">
                You can skip this step and add projects later.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}
          
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`btn-accent py-2.5 px-6 flex items-center gap-2 text-sm ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-accent py-2.5 px-6 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> Generate My Path
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OnboardingPage;
