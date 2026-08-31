import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axiosClient';
import confetti from 'canvas-confetti';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, HelpCircle, 
  Award, ArrowLeft, RefreshCw, Check, X, Bookmark, Clock, BarChart3,
  Layers, ShieldAlert, Zap, History, Flame
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Animation variants
const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const AssessmentPage = () => {
  const [assessmentsData, setAssessmentsData] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const [regeneratingPath, setRegeneratingPath] = useState(false);
  const [pathUpdateSuccess, setPathUpdateSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data } = await API.get('/assessments');
      setAssessmentsData(data);
    } catch (err) {
      console.error("Fetch assessments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setResultData(null);
    setPathUpdateSuccess(false);
  };

  const handleSelectOption = (questionId, optionIdx) => {
    if (resultData) return; // Disallow changes after submission
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmit = async () => {
    if (!selectedAssessment) return;
    
    // Check if user has answered all questions
    const unansweredCount = selectedAssessment.questions.filter(
      q => userAnswers[q.id] === undefined
    ).length;

    if (unansweredCount > 0) {
      const proceed = window.confirm(`You have ${unansweredCount} unanswered questions out of ${selectedAssessment.questions.length}. Do you want to submit anyway?`);
      if (!proceed) return;
    }

    setSubmitting(true);
    try {
      const { data } = await API.post(`/assessments/${selectedAssessment._id}/submit`, {
        skillName: selectedAssessment.skillName,
        moduleId: selectedAssessment.moduleId,
        learningPathNodeId: selectedAssessment.learningPathNodeId,
        answers: userAnswers,
        questions: selectedAssessment.questions
      });

      setResultData(data);
      if (data.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = async () => {
    if (!selectedAssessment) return;
    setRetaking(true);
    setToastMessage('');
    try {
      const { data } = await API.post('/assessments/retake', {
        skillName: selectedAssessment.skillName,
        moduleId: selectedAssessment.moduleId,
        learningPathNodeId: selectedAssessment.learningPathNodeId
      });

      setSelectedAssessment(data.assessment);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setResultData(null);
      setToastMessage(data.message || `Loaded Attempt #${data.assessment.attemptNumber} with a brand new question set!`);
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to retake assessment.");
    } finally {
      setRetaking(false);
    }
  };

  const handleAdjustPath = async () => {
    setRegeneratingPath(true);
    try {
      await API.post('/roadmap/regenerate');
      setPathUpdateSuccess(true);
      setTimeout(() => {
        setPathUpdateSuccess(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate learning path.");
    } finally {
      setRegeneratingPath(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-lime-400 font-bold">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Calibrating Skill Evaluations (15 Questions Minimum Guarantee)...</span>
          </div>
        </div>
      </div>
    );
  }

  const assessments = assessmentsData?.assessments || [];
  const hasSkills = assessmentsData?.hasSkills;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {/* Header Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-900 via-brand-950/30 to-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black tracking-widest text-lime-400 uppercase">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>Skill Verification Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Technical Assessments</h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Every skill assessment contains a minimum of 15 questions, rotates fresh questions on each attempt, and calibrates your verified skill proficiency.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-500 uppercase font-black">Standard</span>
                <div className="text-sm font-black text-lime-400">15+ Questions / Attempt</div>
              </div>
            </div>
          </div>

          {toastMessage && (
            <div className="p-4 rounded-2xl bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!hasSkills ? (
              <motion.div 
                key="no-skills"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-white uppercase">No Skills Profile Found</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You need to add technical skills or complete your onboarding resume scan to generate personalized assessments.
                  </p>
                </div>
                <Link 
                  to="/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase tracking-wider transition"
                >
                  <span>Build My Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : !selectedAssessment ? (
              <motion.div 
                key="list"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {assessments.map((assess) => (
                  <motion.div 
                    key={assess._id} 
                    variants={cardVariants}
                    className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between space-y-5 hover:border-lime-400/30 transition shadow-lg group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center font-bold">
                            <Award className="w-6 h-6 group-hover:scale-110 transition" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-lg text-white tracking-wide">{assess.title}</h3>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">{assess.category}</span>
                          </div>
                        </div>

                        {assess.attemptNumber > 1 && (
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-300">
                            Attempt #{assess.attemptNumber}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        Assess your technical knowledge and core fundamentals in {assess.skillName}. Successful completion updates your verified skill badge.
                      </p>

                      <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>~{assess.durationMinutes} mins</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-300">
                          <Layers className="w-3.5 h-3.5 text-lime-400" />
                          <span>Questions: {assess.questions.length}</span>
                        </span>
                        {assess.bestScore !== null && assess.bestScore !== undefined && (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold ml-auto">
                            <Award className="w-3.5 h-3.5" />
                            <span>Best: {assess.bestScore}%</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleStart(assess)}
                      className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-lime-400/40 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                    >
                      <span>{assess.attemptNumber > 1 ? `Start Attempt #${assess.attemptNumber}` : 'Start Assessment (15 Questions)'}</span>
                      <ArrowRight className="w-4 h-4 text-lime-400" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="quiz"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl"
              >
                {/* Quiz Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-5">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-lime-400 uppercase mb-1">
                      <span>Attempt #{selectedAssessment.attemptNumber || 1}</span>
                      <span>•</span>
                      <span>{selectedAssessment.questions.length} Real Questions</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{selectedAssessment.title}</h2>
                  </div>

                  {resultData ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleRetake}
                        disabled={retaking}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition flex items-center gap-2 shadow"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-lime-400 ${retaking ? 'animate-spin' : ''}`} />
                        <span>{retaking ? 'Generating New Set...' : 'Retake (New Question Set)'}</span>
                      </button>

                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-400/10 border border-lime-400/20">
                        <span className="text-xs font-black text-lime-400 uppercase">Score</span>
                        <span className="text-lg font-black text-lime-400">{resultData.scorePercentage}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>~{selectedAssessment.durationMinutes} mins</span>
                    </div>
                  )}
                </div>

                {/* Score & Post-Quiz Analysis Report */}
                {resultData && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl bg-slate-950 border border-slate-850 space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Score</span>
                        <div className="text-2xl font-black text-white">{resultData.scorePercentage}%</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Correct Answers</span>
                        <div className="text-2xl font-black text-white">{resultData.correctAnswers} / {resultData.totalQuestions}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Estimated Level</span>
                        <div className="text-2xl font-black text-lime-400">{resultData.proficiencyLevel}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Sync Status</span>
                        <div className="text-xs font-extrabold text-lime-400 flex items-center gap-1 mt-2.5">
                          <CheckCircle2 className="w-4 h-4 text-lime-400" />
                          <span>Saved to Profile ✓</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850 pt-4">
                      {/* Strong areas */}
                      <div className="space-y-2">
                        <div className="text-xs font-black text-lime-400 uppercase tracking-widest">Strong Areas</div>
                        {(resultData.strongTopics || []).length === 0 ? (
                          <div className="text-xs text-slate-500">None detected. Keep practicing!</div>
                        ) : (
                          <div className="space-y-1.5">
                            {resultData.strongTopics.map((topic, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Needs Practice */}
                      <div className="space-y-2">
                        <div className="text-xs font-black text-amber-400 uppercase tracking-widest font-extrabold">Needs Practice</div>
                        {(resultData.weakTopics || []).length === 0 ? (
                          <div className="text-xs text-lime-400 font-extrabold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> All topics cleared!
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {resultData.weakTopics.map((topic, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attempt History Section */}
                    {selectedAssessment.previousAttempts && selectedAssessment.previousAttempts.length > 0 && (
                      <div className="border-t border-slate-850 pt-4 space-y-2">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-lime-400" />
                          <span>Previous Attempt History</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {selectedAssessment.previousAttempts.map((att, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-slate-300">Attempt #{att.attemptNumber}</span>
                                <div className="text-[10px] text-slate-500">{new Date(att.completedAt).toLocaleDateString()}</div>
                              </div>
                              <span className={`font-black ${att.score >= 70 ? 'text-lime-400' : 'text-amber-400'}`}>
                                {att.score}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button 
                        onClick={handleRetake}
                        disabled={retaking}
                        className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20"
                      >
                        <RefreshCw className={`w-4 h-4 ${retaking ? 'animate-spin' : ''}`} />
                        <span>Retake Assessment (New Question Set)</span>
                      </button>

                      <button 
                        onClick={handleAdjustPath}
                        disabled={regeneratingPath}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        {regeneratingPath ? 'Recalibrating Path...' : 'Adjust My Learning Path'}
                      </button>

                      <Link 
                        to="/profile" 
                        className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 text-center transition"
                      >
                        Back to My Skills
                      </Link>
                    </div>

                    {pathUpdateSuccess && (
                      <div className="p-3 rounded-xl bg-lime-400/5 border border-lime-400/25 text-lime-400 text-xs font-extrabold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Success! Your custom learning path has been regenerated to match your verified skills.</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step-by-Step Quiz Navigation Panel */}
                {!resultData && (
                  <div className="space-y-6">
                    {/* Bubbles navigation */}
                    <div className="flex flex-wrap gap-2 justify-center py-2 border-b border-slate-850">
                      {selectedAssessment.questions.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-8 h-8 rounded-xl border text-[10px] font-black transition flex items-center justify-center ${
                            currentQuestionIndex === idx
                              ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-md shadow-lime-400/20'
                              : userAnswers[selectedAssessment.questions[idx].id] !== undefined
                              ? 'bg-slate-850 text-slate-100 border-slate-700'
                              : 'bg-slate-950 text-slate-500 border-slate-850 hover:border-slate-800'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Question Display Card */}
                    <AnimatePresence mode="wait">
                      {selectedAssessment.questions.map((q, idx) => {
                        if (idx !== currentQuestionIndex) return null;
                        return (
                          <motion.div 
                            key={q.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-5"
                          >
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <span>Question {idx+1} of {selectedAssessment.questions.length}</span>
                              <span className="text-lime-400 font-bold px-2 py-0.5 rounded bg-lime-400/10 border border-lime-400/20">{q.topic || 'Fundamentals'}</span>
                            </div>

                            <div className="text-base font-extrabold text-white leading-relaxed">
                              {q.text}
                            </div>

                            <div className="grid grid-cols-1 gap-3 pt-2">
                              {q.options.map((opt, optIdx) => (
                                <button 
                                  key={optIdx}
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`p-4 rounded-2xl border text-left text-xs font-semibold leading-relaxed transition flex justify-between items-center ${
                                    userAnswers[q.id] === optIdx
                                      ? 'bg-lime-400/10 border-lime-400 text-white'
                                      : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-800'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    userAnswers[q.id] === optIdx 
                                      ? 'border-lime-400 bg-lime-400' 
                                      : 'border-slate-700'
                                  }`}>
                                    {userAnswers[q.id] === optIdx && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center border-t border-slate-850 pt-6">
                      <button 
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-850 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      {currentQuestionIndex < selectedAssessment.questions.length - 1 ? (
                        <button 
                          onClick={() => setCurrentQuestionIndex(prev => Math.min(selectedAssessment.questions.length - 1, prev + 1))}
                          className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:bg-lime-400/50 text-slate-950 text-xs font-black tracking-wider uppercase transition shadow-lg shadow-lime-400/20"
                        >
                          {submitting ? 'Submitting & Grading...' : 'Finish & Grade Quiz'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Graded Questions List (rendered post-submit only) */}
                {resultData && resultData.gradedQuestions && (
                  <div className="space-y-6 border-t border-slate-850 pt-8">
                    <h3 className="font-extrabold text-lg text-white uppercase tracking-wider">Quiz Review ({resultData.gradedQuestions.length} Questions)</h3>
                    <div className="space-y-6">
                      {resultData.gradedQuestions.map((gq, idx) => (
                        <div key={gq.id || idx} className="p-5 rounded-3xl bg-slate-950 border border-slate-850 space-y-4">
                          <div className="flex justify-between items-start text-[10px] font-black text-slate-500 uppercase">
                            <span>Question {idx+1} • {gq.topic}</span>
                            <span className={gq.isCorrect ? 'text-lime-400 font-bold' : 'text-red-400 font-bold'}>
                              {gq.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                            </span>
                          </div>

                          <div className="text-sm font-extrabold text-white leading-relaxed">{gq.text}</div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {gq.options.map((opt, optIdx) => {
                              const isSelected = gq.userAnswer === optIdx;
                              const isCorrect = gq.correctIndex === optIdx;
                              
                              let borderClass = 'border-slate-850 bg-slate-950/40 text-slate-400';
                              if (isCorrect) {
                                borderClass = 'border-lime-400/30 bg-lime-400/5 text-lime-400 font-semibold';
                              } else if (isSelected && !isCorrect) {
                                borderClass = 'border-red-400/30 bg-red-400/5 text-red-400';
                              }

                              return (
                                <div 
                                  key={optIdx} 
                                  className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between ${borderClass}`}
                                >
                                  <span>{opt}</span>
                                  <div className="shrink-0">
                                    {isCorrect && <Check className="w-4 h-4 text-lime-400" />}
                                    {isSelected && !isCorrect && <X className="w-4 h-4 text-red-400" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {gq.explanation && (
                            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-850 text-xs text-slate-300 leading-relaxed">
                              <strong className="text-lime-400">Explanation:</strong> {gq.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back Link */}
                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setSelectedAssessment(null)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Assessments List</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
};

export default AssessmentPage;
