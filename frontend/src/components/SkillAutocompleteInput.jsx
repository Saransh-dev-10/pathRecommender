import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axiosClient';
import { Search, Check, AlertCircle, Sparkles, X, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeSkillName } from '../utils/normalizeSkill';

const PROFICIENCY_OPTIONS = [
  { level: 'Beginner', label: 'Beginner', desc: '~30% proficiency (Basic concepts & syntax)' },
  { level: 'Intermediate', label: 'Intermediate', desc: '~60% proficiency (Working with libraries & APIs)' },
  { level: 'Advanced', label: 'Advanced', desc: '~85% proficiency (Complex architectures & debugging)' },
  { level: 'Expert', label: 'Expert', desc: '~95% proficiency (Deep internals & system optimization)' },
  { level: 'Not sure', label: 'Not sure', desc: 'Not assessed yet (Take a quiz later to calibrate)' }
];

const SkillAutocompleteInput = ({
  onAddSkill,
  existingSkills = [],
  autoFocus = false,
  showProficiencyPicker = true,
  placeholder = 'Search skills (e.g. Node.js, React, PostgreSQL)...'
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [isAiValidating, setIsAiValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Normalize list of existing skills for duplicate detection
  const existingSet = new Set(
    (existingSkills || []).map(s => normalizeSkillName(typeof s === 'string' ? s : s.skillName))
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      try {
        const { data } = await API.get('/skills/search?limit=8');
        setSuggestions(data.skills || []);
      } catch (err) {
        setSuggestions([]);
      }
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const { data } = await API.get(`/skills/search?q=${encodeURIComponent(searchQuery.trim())}&limit=8`);
      setSuggestions(data.skills || []);
    } catch (err) {
      console.error('Search skills error:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedSkill(null);
    setErrorMessage('');
    setIsOpen(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 200);
  };

  const handleSelectSuggestion = (skillObj) => {
    const norm = normalizeSkillName(skillObj.name);
    if (existingSet.has(norm)) {
      setErrorMessage(`"${skillObj.name}" is already in your skills profile.`);
      return;
    }

    setSelectedSkill(skillObj);
    setQuery(skillObj.name);
    setIsOpen(false);
    setErrorMessage('');
  };

  // AI Validation fallback for unlisted custom skill
  const handleAiValidation = async () => {
    if (!query.trim()) return;
    setIsAiValidating(true);
    setErrorMessage('');
    try {
      const { data } = await API.post('/skills/validate', { skill: query.trim() });
      if (data.isValid && data.canonicalName) {
        const norm = normalizeSkillName(data.canonicalName);
        if (existingSet.has(norm)) {
          setErrorMessage(`"${data.canonicalName}" is already in your skills.`);
        } else {
          setSelectedSkill({
            name: data.canonicalName,
            category: data.category || 'General',
            description: 'AI-verified recognized skill'
          });
          setQuery(data.canonicalName);
          setIsOpen(false);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'No recognized skill found. Please select from taxonomy.';
      setErrorMessage(msg);
    } finally {
      setIsAiValidating(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedSkill) {
      setErrorMessage('Please select a valid recognized skill from the suggestions.');
      return;
    }

    const norm = normalizeSkillName(selectedSkill.name);
    if (existingSet.has(norm)) {
      setErrorMessage(`"${selectedSkill.name}" is already in your skills.`);
      return;
    }

    setSubmitting(true);
    try {
      await onAddSkill({
        skillName: selectedSkill.name,
        category: selectedSkill.category || 'General',
        level: selectedLevel === 'Not sure' ? 'Beginner' : selectedLevel,
        declaredLevel: selectedLevel
      });

      // Reset state on successful addition
      setSelectedSkill(null);
      setQuery('');
      setErrorMessage('');
      setIsOpen(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add skill.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-4 w-full text-left select-none">
      
      {/* Search Input Box */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 focus-within:border-lime-400 focus-within:ring-1 focus-within:ring-lime-400 transition shadow-inner">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsOpen(true);
              if (!query) fetchSuggestions('');
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedSkill(null);
                setErrorMessage('');
                fetchSuggestions('');
              }}
              className="text-slate-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto"
            >
              <div className="p-2 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800/80 px-3">
                {query ? 'Recognized Skills Matching Query' : 'Popular Recognized Skills'}
              </div>

              {loading ? (
                <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-lime-400" />
                  <span>Searching skill taxonomy...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="divide-y divide-slate-850">
                  {suggestions.map((item, idx) => {
                    const isAlreadyAdded = existingSet.has(normalizeSkillName(item.name));
                    const isSelected = selectedSkill?.name === item.name;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        disabled={isAlreadyAdded}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition ${
                          isAlreadyAdded
                            ? 'opacity-40 cursor-not-allowed bg-slate-950/40'
                            : isSelected
                            ? 'bg-lime-400/10 text-lime-400'
                            : 'hover:bg-slate-800/80 text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                              {item.category || 'General'}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {isAlreadyAdded ? (
                          <span className="text-[10px] font-bold text-lime-400/80 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Already in profile</span>
                          </span>
                        ) : isSelected ? (
                          <Check className="w-4 h-4 text-lime-400 shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center space-y-2">
                  <div className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>No recognized skill found for "{query}"</span>
                  </div>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                    PathRecommender only stores legitimate technical skills. Try searching by standard technology names or verify with AI.
                  </p>
                  <button
                    type="button"
                    onClick={handleAiValidation}
                    disabled={isAiValidating}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-lime-400 text-xs font-bold transition border border-lime-400/20"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAiValidating ? 'animate-spin' : ''}`} />
                    <span>{isAiValidating ? 'Checking with AI...' : 'Verify New Skill with AI'}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Skill Badge & Proficiency Picker */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-slate-950 border border-lime-400/30 space-y-4 shadow-lg"
        >
          {/* Selected Skill Info */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-lime-400">Selected Skill</div>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>{selectedSkill.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {selectedSkill.category}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedSkill(null);
                setQuery('');
              }}
              className="text-slate-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Proficiency Picker */}
          {showProficiencyPicker && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                How well do you know this skill?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROFICIENCY_OPTIONS.map((opt) => {
                  const isChecked = selectedLevel === opt.level;
                  return (
                    <button
                      key={opt.level}
                      type="button"
                      onClick={() => setSelectedLevel(opt.level)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        isChecked
                          ? 'bg-lime-400/10 border-lime-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold">{opt.label}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isChecked ? 'border-lime-400 bg-lime-400' : 'border-slate-700'
                        }`}>
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Action */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black tracking-wider uppercase transition flex items-center justify-center gap-1.5 shadow-lg shadow-lime-400/20"
          >
            {submitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Adding Skill...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add {selectedSkill.name} to Profile</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Error / Validation Feedback */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

    </div>
  );
};

export default SkillAutocompleteInput;
