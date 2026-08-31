const { CANONICAL_SKILLS, SKILL_ALIASES, CANONICAL_MAP, normalizeSkillKey } = require('../taxonomy/skillsTaxonomy');
const Skill = require('../models/Skill');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn('SkillValidation: Failed to initialize GoogleGenerativeAI:', err.message);
  }
}

/**
 * Standardize skill level to declared score percentage
 */
const levelToProficiencyScore = (level) => {
  switch (level) {
    case 'Beginner':
      return 30;
    case 'Intermediate':
      return 60;
    case 'Advanced':
      return 85;
    case 'Expert':
      return 95;
    case 'Not sure':
    case 'Not Assessed':
    default:
      return 0;
  }
};

/**
 * Normalization helper (mirrors taxonomy helper)
 */
const normalizeSkillName = (s) => normalizeSkillKey(s);

/**
 * Search skills in taxonomy + MongoDB for autocomplete suggestions.
 * Returns up to `limit` matches ranked by relevance.
 */
const searchSkills = async (query, limit = 10) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    // Return top popular skills
    return CANONICAL_SKILLS.slice(0, limit).map(s => ({
      name: s.name,
      category: s.category,
      description: s.description
    }));
  }

  const qTrim = query.trim().toLowerCase();
  const qNorm = normalizeSkillKey(query);

  const matched = new Map();

  // 1. Direct Alias exact hit
  if (SKILL_ALIASES[qNorm]) {
    const canonical = SKILL_ALIASES[qNorm];
    const skillObj = CANONICAL_MAP.get(normalizeSkillKey(canonical));
    if (skillObj) {
      matched.set(skillObj.name, { ...skillObj, rank: 1 });
    }
  }

  // 2. Scan Canonical Skills
  CANONICAL_SKILLS.forEach(skill => {
    const sNameLower = skill.name.toLowerCase();
    const sNorm = normalizeSkillKey(skill.name);

    if (sNameLower === qTrim || sNorm === qNorm) {
      matched.set(skill.name, { ...skill, rank: 1 });
    } else if (sNameLower.startsWith(qTrim)) {
      matched.set(skill.name, { ...skill, rank: 2 });
    } else if (sNameLower.includes(qTrim)) {
      if (!matched.has(skill.name)) {
        matched.set(skill.name, { ...skill, rank: 3 });
      }
    } else if (skill.category.toLowerCase().includes(qTrim)) {
      if (!matched.has(skill.name)) {
        matched.set(skill.name, { ...skill, rank: 4 });
      }
    }
  });

  // 3. Scan Aliases for substring hits
  Object.entries(SKILL_ALIASES).forEach(([aliasNorm, canonicalName]) => {
    if (aliasNorm.includes(qNorm) || aliasNorm.startsWith(qNorm)) {
      const skillObj = CANONICAL_MAP.get(normalizeSkillKey(canonicalName));
      if (skillObj && !matched.has(skillObj.name)) {
        matched.set(skillObj.name, { ...skillObj, rank: 3 });
      }
    }
  });

  // 4. Also check custom skills saved in MongoDB if connected
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      const dbSkills = await Skill.find({
        name: { $regex: new RegExp(qTrim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
      }).limit(limit);

      dbSkills.forEach(ds => {
        if (!matched.has(ds.name)) {
          matched.set(ds.name, {
            name: ds.name,
            category: ds.category || 'General',
            description: ds.description || '',
            rank: 3
          });
        }
      });
    } catch (err) {
      // Ignore db search error fallback to memory
    }
  }

  // Sort by rank and return top results
  const results = Array.from(matched.values())
    .sort((a, b) => (a.rank || 5) - (b.rank || 5) || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(s => ({
      name: s.name,
      category: s.category,
      description: s.description || ''
    }));

  return results;
};

/**
 * AI-assisted validator for unknown skills using Gemini.
 * Strictly verifies whether an input is a genuine software/technical/professional skill.
 */
const validateSkillWithAI = async (rawSkill) => {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    return {
      isValid: false,
      message: 'Please select a valid recognized skill from the taxonomy.'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are a strict technical skill validator for an engineering learning path platform.
Analyze the user's input: "${rawSkill.slice(0, 100)}".

Determine if this represents a REAL, LEGITIMATE technical, engineering, programming, database, cloud, devops, design, or professional software skill/technology.

Reject all:
- Random keystrokes or gibberish (e.g., "asdfgh", "xyz123", "abcd", "something", "test123", "random skill")
- Generic non-skill English phrases or slang (e.g., "fast learning", "good boy", "nice")
- Non-existent tech names

Return ONLY valid JSON matching this schema:
{
  "isValid": boolean,
  "canonicalName": "Properly capitalized canonical name if valid (or empty string)",
  "category": "Frontend" | "Backend" | "Database" | "Cloud & DevOps" | "Data & AI" | "Programming Language" | "Architecture & System Design" | "Testing & QA" | "Security" | "Design & Creative" | "Developer Tools" | "Computer Science" | "General",
  "reason": "Brief explanation"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.isValid && parsed.canonicalName && parsed.canonicalName.trim().length > 1) {
        return {
          isValid: true,
          canonicalName: parsed.canonicalName.trim(),
          category: parsed.category || 'General',
          reason: parsed.reason || 'AI verified legitimate technical skill'
        };
      }
    }
  } catch (err) {
    console.warn('AI Skill Validation error:', err.message);
  }

  return {
    isValid: false,
    message: 'Please select a valid recognized skill.'
  };
};

/**
 * Validate a skill input:
 * 1. Checks taxonomy & alias dictionary.
 * 2. Checks MongoDB registered skills.
 * 3. Falls back to AI verification for emerging or unlisted real technologies.
 */
const validateSkill = async (rawSkill, allowAIFallback = true) => {
  if (!rawSkill || typeof rawSkill !== 'string') {
    return {
      isValid: false,
      message: 'Skill name is required.'
    };
  }

  const trimmed = rawSkill.trim();
  if (trimmed.length < 1 || trimmed.length > 80) {
    return {
      isValid: false,
      message: 'Please select a valid recognized skill.'
    };
  }

  const norm = normalizeSkillKey(trimmed);
  if (!norm) {
    return {
      isValid: false,
      message: 'Please select a valid recognized skill.'
    };
  }

  // 1. Direct check in Alias Dictionary
  if (SKILL_ALIASES[norm]) {
    const canonicalName = SKILL_ALIASES[norm];
    const skillObj = CANONICAL_MAP.get(normalizeSkillKey(canonicalName));
    return {
      isValid: true,
      canonicalName: canonicalName,
      category: skillObj ? skillObj.category : 'General',
      description: skillObj ? skillObj.description : '',
      source: 'taxonomy'
    };
  }

  // 2. Direct check in Canonical Skills
  const directMatch = CANONICAL_SKILLS.find(s => normalizeSkillKey(s.name) === norm);
  if (directMatch) {
    return {
      isValid: true,
      canonicalName: directMatch.name,
      category: directMatch.category,
      description: directMatch.description,
      source: 'taxonomy'
    };
  }

  // 3. Check MongoDB Skill collection if connected
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      const dbSkill = await Skill.findOne({
        $or: [
          { name: new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        ]
      });
      if (dbSkill) {
        return {
          isValid: true,
          canonicalName: dbSkill.name,
          category: dbSkill.category || 'General',
          description: dbSkill.description || '',
          source: 'database'
        };
      }
    } catch (err) {
      // continue
    }
  }

  // 4. If not in taxonomy, perform AI validation if enabled
  if (allowAIFallback) {
    const aiResult = await validateSkillWithAI(trimmed);
    if (aiResult.isValid && aiResult.canonicalName) {
      // Save newly verified skill into MongoDB so future lookups are instant
      try {
        await Skill.findOneAndUpdate(
          { name: aiResult.canonicalName },
          {
            name: aiResult.canonicalName,
            category: aiResult.category || 'General',
            description: `Community/AI-verified technology: ${aiResult.canonicalName}`
          },
          { upsert: true, new: true }
        );
      } catch (saveErr) {
        // ignore duplicate key
      }

      return {
        isValid: true,
        canonicalName: aiResult.canonicalName,
        category: aiResult.category || 'General',
        source: 'ai-verified'
      };
    }
  }

  // Reject invalid / unrecognized skill
  return {
    isValid: false,
    message: 'Please select a valid recognized skill.'
  };
};

module.exports = {
  normalizeSkillName,
  searchSkills,
  validateSkill,
  validateSkillWithAI,
  levelToProficiencyScore
};
