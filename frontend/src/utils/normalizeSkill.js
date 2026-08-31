/**
 * Normalize a skill name for comparison.
 * Strips whitespace, dots, hyphens, underscores and lowercases.
 * Mirrors the backend normalizeSkill function.
 */
export const normalizeSkillName = (s) =>
  (s || '').toLowerCase().trim().replace(/[.\s\-_]/g, '');

/**
 * Check if two skill names are equivalent after normalization.
 */
export const skillsMatch = (a, b) =>
  normalizeSkillName(a) === normalizeSkillName(b);
