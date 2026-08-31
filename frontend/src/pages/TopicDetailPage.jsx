import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosClient';
import confetti from 'canvas-confetti';
import { 
  BookOpen, Sparkles, CheckCircle2, AlertTriangle, ArrowLeft, 
  ExternalLink, Code2, Award, Clock, HelpCircle, RefreshCw, 
  Check, X, Zap, Layers, History, ArrowRight, CheckSquare, Square,
  ListOrdered, Target, Compass, ChevronDown, ChevronUp, BarChart3,
  BookmarkCheck, ShieldAlert, Lock, Unlock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const TopicDetailPage = () => {
  const { topicId, moduleId } = useParams();
  const activeId = topicId || moduleId;
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [previousNode, setPreviousNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [savingProgress, setSavingProgress] = useState(false);

  // Interactive study and practice task progress
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({});

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [retakingQuiz, setRetakingQuiz] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (activeId) {
      fetchTopic();
    }
  }, [activeId]);

  const fetchTopic = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data } = await API.get(`/roadmap/topic/${activeId}`);
      const moduleData = data.topic || data.module;
      
      if (!moduleData) {
        throw new Error("Module details not found in server response.");
      }

      setTopic(moduleData);
      setIsCompleted(!!data.isCompleted);
      setIsLocked(!!data.isLocked);
      setPreviousNode(data.previousNode || null);
      
      // Initialize study checklist
      const userStudyTopics = new Set(moduleData.completedStudyTopics || []);
      const userPracticeTasks = new Set(moduleData.completedPracticeTasks || []);
      setCompletedTopics(userStudyTopics);
      setCompletedTasks(userPracticeTasks);

      // Auto-expand all section accordions by default
      const initialExpanded = {};
      (moduleData.topicsToCover || []).forEach((_, idx) => {
        initialExpanded[idx] = true;
      });
      setExpandedSections(initialExpanded);

    } catch (err) {
      console.error("Fetch topic error:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Unable to load this learning module.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleToggleTopic = async (topicTitle) => {
    const updated = new Set(completedTopics);
    if (updated.has(topicTitle)) {
      updated.delete(topicTitle);
    } else {
      updated.add(topicTitle);
    }
    setCompletedTopics(updated);
    await persistUserProgress(Array.from(updated), Array.from(completedTasks));
  };

  const handleToggleTask = async (taskId) => {
    const updated = new Set(completedTasks);
    if (updated.has(taskId)) {
      updated.delete(taskId);
    } else {
      updated.add(taskId);
    }
    setCompletedTasks(updated);
    await persistUserProgress(Array.from(completedTopics), Array.from(updated));
  };

  const persistUserProgress = async (topicList, taskList) => {
    setSavingProgress(true);
    try {
      await API.post(`/roadmap/topic/${activeId}/progress`, {
        completedTopics: topicList,
        completedPracticeTasks: taskList
      });
    } catch (err) {
      console.error("Failed to save module progress:", err);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleOptionSelect = (qId, optionIdx) => {
    if (quizResult) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!topic?.quiz || topic.quiz.length === 0) return;

    const unansweredCount = topic.quiz.filter(q => answers[q.id] === undefined).length;
    if (unansweredCount > 0) {
      const proceed = window.confirm(`You have ${unansweredCount} unanswered questions out of ${topic.quiz.length}. Submit anyway?`);
      if (!proceed) return;
    }

    setSubmittingQuiz(true);
    setQuizResult(null);

    try {
      const { data } = await API.post('/roadmap/quiz/submit', {
        topicId: activeId,
        nodeId: activeId,
        topicName: topic.topic,
        answers,
        questions: topic.quiz
      });

      setQuizResult(data);

      if (data.passed) {
        setIsCompleted(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleRetakeQuiz = async () => {
    setRetakingQuiz(true);
    setToastMessage('');
    try {
      const { data } = await API.post('/assessments/retake', {
        skillName: topic.topic,
        moduleId: topic.id,
        learningPathNodeId: topic.id
      });

      setTopic(prev => ({
        ...prev,
        quiz: data.assessment.questions,
        totalQuestions: data.assessment.questions.length,
        attemptNumber: data.assessment.attemptNumber,
        difficultyDistribution: data.assessment.difficultyDistribution
      }));

      setCurrentQuestionIndex(0);
      setAnswers({});
      setQuizResult(null);
      setToastMessage(`Generated fresh Attempt #${data.assessment.attemptNumber} with a brand new set of questions!`);
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to retake quiz.");
    } finally {
      setRetakingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-lime-400 font-bold p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-lime-400" />
            <span className="text-sm font-extrabold tracking-wide text-white">Loading your personalized learning module...</span>
            <span className="text-xs text-slate-400">Calibrating curriculum, practice tasks, and 15+ question assessment</span>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !topic) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl text-center max-w-md space-y-5 border-rose-500/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white">Unable to Load Learning Module</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{errorMsg || "The requested module could not be retrieved from your learning path."}</p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button 
                onClick={fetchTopic}
                className="px-5 py-2.5 rounded-xl bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-lime-300 transition"
              >
                Try Again
              </button>
              <Link 
                to="/path" 
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-850 transition"
              >
                Back to My Path
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = topic.quiz || [];
  
  // Calculate module overall progress
  const allSubtopics = (topic.topicsToCover || []).flatMap(sec => sec.subtopics || []);
  const totalSubtopicsCount = Math.max(1, allSubtopics.length);
  const completedTopicsCount = completedTopics.size;
  const topicProgressPct = Math.round((completedTopicsCount / totalSubtopicsCount) * 100);

  const practiceTasksCount = Math.max(1, (topic.practiceTasks || []).length);
  const completedTasksCount = completedTasks.size;
  const practiceProgressPct = Math.round((completedTasksCount / practiceTasksCount) * 100);

  const isQuizPassed = isCompleted || (quizResult && quizResult.passed);
  const overallModuleProgress = Math.round(
    (topicProgressPct * 0.4) + (practiceProgressPct * 0.3) + (isQuizPassed ? 30 : 0)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <Link to="/path" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Path</span>
            </Link>

            <div className="flex items-center gap-3">
              {savingProgress && (
                <span className="text-[10px] text-lime-400 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                </span>
              )}
              <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border ${
                isCompleted 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : isLocked
                  ? 'bg-slate-900 text-slate-500 border-slate-800'
                  : 'bg-lime-400/10 text-lime-400 border-lime-400/30'
              }`}>
                {isCompleted ? 'Module Mastered ✓' : isLocked ? 'Locked Module' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Locked Notice Alert Banner if prerequisite not finished */}
          {isLocked && previousNode && (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 text-amber-300 space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5 font-extrabold text-sm text-amber-400">
                <Lock className="w-5 h-5 shrink-0" />
                <span>Complete the previous module to unlock full certification</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You are previewing this module. To master your learning roadmap in optimal sequence, please finish the prerequisite module first.
              </p>
              <div className="pt-1">
                <Link
                  to={`/path/module/${previousNode.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition"
                >
                  <span>Go to Previous Module: {previousNode.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {toastMessage && (
            <div className="p-4 rounded-2xl bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Module Header & Metadata Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-900 via-brand-950/40 to-indigo-950/30 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wider text-lime-400">
                  <span>{topic.category || 'Core'} Module</span>
                  <span>•</span>
                  <span>Target: {topic.targetLevel || topic.difficulty || 'Intermediate'}</span>
                  <span>•</span>
                  <span>~{topic.estimatedHours || 6} Hours Estimated</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{topic.title || topic.topic}</h1>
              </div>

              {topic.skillGapPercentage > 0 && (
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-right shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase font-black">Skill Gap</span>
                  <div className="text-xl font-black text-amber-400">{topic.skillGapPercentage}% Gap</div>
                </div>
              )}
            </div>

            {/* Overview text */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {topic.overview}
            </p>

            {/* Current Level vs Target Level Visual Bar */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Current Level:</span>
                  <span className="text-white font-extrabold">{topic.currentLevel} ({topic.currentScore}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Target Standard:</span>
                  <span className="text-lime-400 font-extrabold">{topic.targetLevel} ({topic.targetScore}%)</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden flex">
                <div 
                  className="bg-lime-400 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${topic.currentScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 1. WHY THIS MODULE IS IN YOUR PATH */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-lime-400 uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Why This Module is in Your Path</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {topic.whyInPath}
            </p>
          </div>

          {/* 2. WHAT YOU WILL LEARN & LEARNING OBJECTIVES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* What You Will Learn */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>What You Will Learn</span>
              </div>
              <ul className="space-y-2.5">
                {(topic.whatYouWillLearn || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Objectives */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest">
                <Target className="w-4 h-4" />
                <span>Learning Objectives</span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">By the end of this module, you should be able to:</p>
              <ul className="space-y-2.5">
                {(topic.learningObjectives || []).map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 3. STRUCTURED STUDY PLAN & CHECKLIST (TOPICS TO COVER) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-lime-400" />
                  <span>Structured Study Curriculum</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Click checkboxes to track your study progress as you cover topics.</p>
              </div>
              <div className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                {completedTopicsCount} / {totalSubtopicsCount} Topics Covered ({topicProgressPct}%)
              </div>
            </div>

            {/* Sections Accordion */}
            <div className="space-y-4">
              {(topic.topicsToCover || []).map((sec, secIdx) => {
                const isExpanded = expandedSections[secIdx];
                return (
                  <div key={secIdx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                    <button
                      onClick={() => toggleSection(secIdx)}
                      className="w-full p-4.5 sm:p-5 flex items-center justify-between text-left hover:bg-slate-850 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-400 font-black text-xs flex items-center justify-center">
                          {sec.sectionNumber}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-white">{sec.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{sec.description}</p>
                        </div>
                      </div>

                      <div className="text-slate-400 ml-2 shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-850/60 space-y-2.5 bg-slate-950/40">
                        {(sec.subtopics || []).map((sub, subIdx) => {
                          const isDone = completedTopics.has(sub);
                          return (
                            <label
                              key={subIdx}
                              onClick={() => handleToggleTopic(sub)}
                              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                                isDone 
                                  ? 'bg-lime-400/10 border-lime-400/30 text-white' 
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="text-lime-400 shrink-0">
                                {isDone ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                              </div>
                              <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                {sub}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. RECOMMENDED STUDY ORDER */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-lime-400 uppercase tracking-widest">
              <Zap className="w-4 h-4" />
              <span>Recommended Study Order</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(topic.recommendedStudyOrder || []).map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
                    <span>{step}</span>
                  </div>
                  {idx < (topic.recommendedStudyOrder || []).length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 5. PRACTICE BEFORE ASSESSMENT & CURATED RESOURCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Practice Tasks */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2 uppercase tracking-wider">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Practice Coding Tasks</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  {completedTasksCount} / {practiceTasksCount} Done
                </span>
              </div>

              <div className="space-y-3">
                {(topic.practiceTasks || []).map((task) => {
                  const isDone = completedTasks.has(task.id);
                  return (
                    <div 
                      key={task.id}
                      className={`p-4 rounded-2xl border space-y-2 transition ${
                        isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{task.title}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          task.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                          task.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {task.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>
                      
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                          isDone 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3 text-emerald-400" /> : <Square className="w-3 h-3" />}
                        <span>{isDone ? 'Completed' : 'Mark Completed'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Curated Resources */}
            <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Curated Resources ({(topic.resources || []).length})</span>
              </h3>

              <div className="space-y-2.5">
                {(topic.resources || []).map((res, idx) => (
                  <a 
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-lime-400/40 transition group block"
                  >
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-lime-300 transition">{res.title}</div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">{res.type || 'Documentation'} • {res.estimatedMinutes || 30} mins</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-lime-400 transition shrink-0" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* 6. MODULE COMPLETION & PROGRESS SUMMARY */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-lime-400" />
                <span>Overall Module Progress</span>
              </div>
              <span className="text-sm font-black text-lime-400">{overallModuleProgress}% Complete</span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden flex">
              <div className="bg-lime-400 h-full rounded-full transition-all duration-500" style={{ width: `${overallModuleProgress}%` }} />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs pt-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Study Topics</span>
                <span className="font-black text-white">{completedTopicsCount} / {totalSubtopicsCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Practice Tasks</span>
                <span className="font-black text-white">{completedTasksCount} / {practiceTasksCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Assessment</span>
                <span className={`font-black ${isQuizPassed ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {isQuizPassed ? 'Passed ✓' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* 7. ASSESSMENT SECTION (READY TO TEST YOUR KNOWLEDGE?) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-400 mb-1">
                  <span>Module Assessment</span>
                  <span>•</span>
                  <span>Attempt #{topic.attemptNumber || 1}</span>
                  <span>•</span>
                  <span>{questions.length} Questions (15+ Guaranteed)</span>
                </div>
                <h3 className="font-extrabold text-xl text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-lime-400" />
                  <span>{topic.title || topic.topic} Knowledge Check</span>
                </h3>
              </div>

              {quizResult ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRetakeQuiz}
                    disabled={retakingQuiz}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition flex items-center gap-2 shadow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-lime-400 ${retakingQuiz ? 'animate-spin' : ''}`} />
                    <span>{retakingQuiz ? 'Generating New Set...' : 'Retake (New Question Set)'}</span>
                  </button>

                  <div className={`px-4 py-2 rounded-2xl font-black text-sm border ${
                    quizResult.passed 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    Score: {quizResult.scorePercentage}% ({quizResult.correctAnswers}/{quizResult.totalQuestions})
                  </div>
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-850 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Score 70%+ to master & verify</span>
                </div>
              )}
            </div>

            {/* Post-Quiz Results Breakdown */}
            {quizResult && (
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-850 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Score</span>
                    <div className="text-2xl font-black text-white">{quizResult.scorePercentage}%</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Result</span>
                    <div className={`text-2xl font-black ${quizResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {quizResult.passed ? 'Node Mastered ✓' : 'Needs Practice'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Updated Proficiency</span>
                    <div className="text-2xl font-black text-lime-400">{quizResult.proficiencyLevel}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850 pt-4">
                  <div className="space-y-2">
                    <div className="text-xs font-black text-lime-400 uppercase tracking-widest">Strong Concepts</div>
                    {(quizResult.strongTopics || []).length === 0 ? (
                      <div className="text-xs text-slate-500">None detected. Retake for a new set of questions!</div>
                    ) : (
                      <div className="space-y-1">
                        {quizResult.strongTopics.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-black text-amber-400 uppercase tracking-widest">Areas to Strengthen</div>
                    {(quizResult.weakTopics || []).length === 0 ? (
                      <div className="text-xs text-lime-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> All concepts cleared!
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {quizResult.weakTopics.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Graded Questions */}
                {quizResult.results && (
                  <div className="space-y-4 border-t border-slate-850 pt-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Detailed Question Review ({quizResult.results.length} Questions)</h4>
                    <div className="space-y-4">
                      {quizResult.results.map((gq, idx) => (
                        <div key={gq.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex justify-between items-start text-[10px] font-bold text-slate-500 uppercase">
                            <span>Question {idx + 1} • {gq.topic}</span>
                            <span className={gq.isCorrect ? 'text-lime-400' : 'text-red-400'}>
                              {gq.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                            </span>
                          </div>
                          <div className="text-xs font-extrabold text-white leading-relaxed">{gq.text}</div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {gq.options.map((opt, optIdx) => {
                              const isSelected = gq.userAnswer === optIdx;
                              const isCorrect = gq.correctIndex === optIdx;
                              let borderClass = 'border-slate-800 bg-slate-950/40 text-slate-400';
                              if (isCorrect) borderClass = 'border-lime-400/30 bg-lime-400/10 text-lime-300 font-semibold';
                              else if (isSelected && !isCorrect) borderClass = 'border-red-400/30 bg-red-400/10 text-red-300';

                              return (
                                <div key={optIdx} className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${borderClass}`}>
                                  <span>{opt}</span>
                                  {isCorrect && <Check className="w-3.5 h-3.5 text-lime-400" />}
                                  {isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-red-400" />}
                                </div>
                              );
                            })}
                          </div>

                          {gq.explanation && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                              <strong className="text-lime-400">Explanation:</strong> {gq.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleRetakeQuiz}
                    disabled={retakingQuiz}
                    className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${retakingQuiz ? 'animate-spin' : ''}`} />
                    <span>Retake Quiz (New Questions)</span>
                  </button>
                  <Link
                    to="/path"
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white transition flex items-center gap-2"
                  >
                    <span>Continue My Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Active Quiz Taking Stepper / Questions */}
            {!quizResult && (
              <div className="space-y-6">
                {/* Stepper bubbles */}
                <div className="flex flex-wrap gap-2 justify-center py-2 border-b border-slate-850">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-xl border text-[10px] font-black transition flex items-center justify-center ${
                        currentQuestionIndex === idx
                          ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-md shadow-lime-400/20'
                          : answers[questions[idx].id] !== undefined
                          ? 'bg-slate-850 text-slate-100 border-slate-700'
                          : 'bg-slate-950 text-slate-500 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Current Question View */}
                {questions.map((q, idx) => {
                  if (idx !== currentQuestionIndex) return null;
                  return (
                    <div key={q.id || idx} className="space-y-5">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Question {idx + 1} of {questions.length}</span>
                        <span className="text-lime-400 font-bold px-2 py-0.5 rounded bg-lime-400/10 border border-lime-400/20">{q.topic || 'Fundamentals'}</span>
                      </div>

                      <div className="text-base font-extrabold text-white leading-relaxed">
                        {q.text || q.question}
                      </div>

                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {q.options.map((opt, optIdx) => (
                          <button 
                            key={optIdx}
                            onClick={() => handleOptionSelect(q.id, optIdx)}
                            className={`p-4 rounded-2xl border text-left text-xs font-semibold leading-relaxed transition flex justify-between items-center ${
                              answers[q.id] === optIdx
                                ? 'bg-lime-400/10 border-lime-400 text-white'
                                : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-800'
                            }`}
                          >
                            <span>{opt}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              answers[q.id] === optIdx 
                                ? 'border-lime-400 bg-lime-400' 
                                : 'border-slate-700'
                            }`}>
                              {answers[q.id] === optIdx && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Navigation and Submission Buttons */}
                <div className="flex justify-between items-center border-t border-slate-850 pt-6">
                  <button 
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-850 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button 
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                      className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmitQuiz}
                      disabled={submittingQuiz || questions.length === 0}
                      className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:bg-lime-400/50 text-slate-950 text-xs font-black tracking-wider uppercase transition shadow-lg shadow-lime-400/20"
                    >
                      {submittingQuiz ? 'Evaluating Answers...' : 'Submit & Grade Quiz'}
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};

export default TopicDetailPage;
