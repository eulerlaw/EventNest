/**
 * EventNest Sentiment Analysis & Theme Extraction Engine
 * Lexicon & Rule-based NLP classifier (VADER-style valence aware dictionary)
 * Tailored for college events, technical workshops, cultural fests & academic activities.
 * 
 * Research reference:
 * - T. Shaik, X. Tao, C. Dann et al. (2023) "Sentiment analysis and opinion mining on educational data"
 */

// Core Sentiment Valence Lexicon (-4 to +4)
const SENTIMENT_LEXICON = {
  // Positive expressions
  'excellent': 3.5,
  'outstanding': 3.8,
  'superb': 3.6,
  'awesome': 3.5,
  'fantastic': 3.7,
  'great': 2.5,
  'good': 1.8,
  'wonderful': 3.2,
  'informative': 2.6,
  'engaging': 2.8,
  'inspiring': 3.0,
  'helpful': 2.3,
  'smooth': 2.0,
  'organized': 2.4,
  'well-organized': 3.2,
  'enjoyable': 2.6,
  'loved': 3.2,
  'like': 1.6,
  'best': 3.4,
  'valuable': 2.8,
  'interactive': 2.4,
  'knowledgeable': 2.7,
  'brilliant': 3.4,
  'clear': 1.8,
  'punctual': 2.0,
  'tasty': 2.0,
  'delicious': 2.5,
  'fun': 2.2,
  'impressive': 2.9,
  'worth': 2.2,
  'worthwhile': 2.6,
  'perfect': 3.8,
  'appreciated': 2.2,
  'friendly': 2.0,
  'supportive': 2.2,

  // Negative expressions
  'terrible': -3.6,
  'horrible': -3.8,
  'poor': -2.5,
  'bad': -2.2,
  'awful': -3.5,
  'disappointing': -2.8,
  'disappointed': -2.7,
  'disorganized': -3.0,
  'unorganized': -2.8,
  'boring': -2.5,
  'bored': -2.2,
  'useless': -3.2,
  'waste': -3.2,
  'delayed': -2.0,
  'late': -1.8,
  'chaotic': -3.0,
  'crowded': -1.8,
  'suffocating': -3.0,
  'inaudible': -2.8,
  'unclear': -2.0,
  'rude': -3.2,
  'slow': -1.5,
  'overcrowded': -2.6,
  'confusing': -2.2,
  'irrelevant': -2.4,
  'worst': -3.8,
  'pathetic': -3.6,
  'unprepared': -2.7,
  'noisy': -1.9,
  'cold': -1.2,
  'hot': -1.2,
  'uncomfortable': -2.4,
  'problem': -1.8,
  'issues': -1.6,
  'fail': -2.8,
  'failed': -2.7
};

// Intensifiers / Boosters
const BOOSTER_WORDS = {
  'very': 1.35,
  'extremely': 1.6,
  'really': 1.3,
  'so': 1.25,
  'absolutely': 1.5,
  'completely': 1.4,
  'highly': 1.35,
  'incredibly': 1.55,
  'super': 1.35,
  'exceptionally': 1.5,
  'slightly': 0.7,
  'somewhat': 0.75,
  'barely': 0.6,
  'hardly': 0.5
};

// Negations
const NEGATION_WORDS = new Set([
  'not', 'never', 'no', 'hardly', 'neither', 'barely', 'scarcely', 'without', 'lack', 'none', "wasn't", "didn't", "aren't", "don't", "cannot"
]);

// Topic / Theme keywords for category tagging
const TOPIC_DOMAINS = {
  'Content & Speaker': ['speaker', 'topic', 'explanation', 'presentation', 'slide', 'knowledge', 'content', 'talk', 'clarity'],
  'Organization & Timing': ['punctual', 'schedule', 'time', 'delay', 'organized', 'management', 'coordinator', 'registration'],
  'Venue & Facilities': ['venue', 'auditorium', 'hall', 'sound', 'mic', 'audio', 'ac', 'seating', 'projector', 'screen', 'room'],
  'Hospitality & Food': ['food', 'refreshments', 'snack', 'tea', 'lunch', 'beverage', 'water'],
  'Interaction & Hands-on': ['hands-on', 'interactive', 'coding', 'practical', 'q&a', 'questions', 'demo', 'activity']
};

/**
 * Clean & tokenize sentence preserving exclamation & caps clues
 */
function analyzeSentiment(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      score: 0,
      label: 'neutral',
      positiveScore: 0,
      negativeScore: 0,
      keywords: [],
      themes: []
    };
  }

  const rawWords = text.replace(/[^a-zA-Z0-9\s!?-]/g, ' ').split(/\s+/).filter(Boolean);
  let totalScore = 0;
  let wordCountWithValence = 0;
  let positiveScore = 0;
  let negativeScore = 0;
  const matchedKeywords = [];

  for (let i = 0; i < rawWords.length; i++) {
    const rawWord = rawWords[i];
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z-]/g, '');

    if (SENTIMENT_LEXICON[cleanWord] !== undefined) {
      let valence = SENTIMENT_LEXICON[cleanWord];

      // Check preceding words for boosters or negation (window of 2 words)
      let boosterMultiplier = 1.0;
      let isNegated = false;

      const prev1 = i > 0 ? rawWords[i - 1].toLowerCase().replace(/[^a-z]/g, '') : null;
      const prev2 = i > 1 ? rawWords[i - 2].toLowerCase().replace(/[^a-z]/g, '') : null;

      if (prev1 && BOOSTER_WORDS[prev1]) boosterMultiplier *= BOOSTER_WORDS[prev1];
      if (prev2 && BOOSTER_WORDS[prev2]) boosterMultiplier *= (BOOSTER_WORDS[prev2] * 0.8);

      if ((prev1 && NEGATION_WORDS.has(prev1)) || (prev2 && NEGATION_WORDS.has(prev2))) {
        isNegated = true;
      }

      valence = valence * boosterMultiplier;
      if (isNegated) {
        valence = -0.75 * valence;
      }

      // Check for capitalization emphasis (e.g. "AWESOME")
      if (rawWord.length > 2 && rawWord === rawWord.toUpperCase()) {
        valence = valence > 0 ? valence + 0.5 : valence - 0.5;
      }

      totalScore += valence;
      wordCountWithValence++;

      if (valence > 0) positiveScore += valence;
      else negativeScore += Math.abs(valence);

      matchedKeywords.push(cleanWord);
    }
  }

  // Exclamation mark boost
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 0) {
    const boost = Math.min(exclamationCount * 0.2, 0.6);
    if (totalScore > 0) totalScore += boost;
    else if (totalScore < 0) totalScore -= boost;
  }

  // Normalized compound score between -1 and +1 using standard VADER normalization
  const alpha = 15;
  const compoundScore = totalScore === 0 ? 0 : totalScore / Math.sqrt((totalScore * totalScore) + alpha);
  const normalizedScore = parseFloat(Math.max(-1, Math.min(1, compoundScore)).toFixed(3));

  let label = 'neutral';
  if (normalizedScore >= 0.08) {
    label = 'positive';
  } else if (normalizedScore <= -0.08) {
    label = 'negative';
  }

  // Extract detected themes
  const lowerText = text.toLowerCase();
  const detectedThemes = [];
  for (const [theme, keywords] of Object.entries(TOPIC_DOMAINS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      detectedThemes.push(theme);
    }
  }

  return {
    score: normalizedScore,
    label,
    positiveScore: parseFloat(positiveScore.toFixed(2)),
    negativeScore: parseFloat(negativeScore.toFixed(2)),
    keywords: Array.from(new Set(matchedKeywords)),
    themes: detectedThemes
  };
}

/**
 * Aggregate sentiment statistics across an array of feedbacks
 */
function aggregateEventSentiment(feedbacks = []) {
  if (!feedbacks || feedbacks.length === 0) {
    return {
      totalFeedback: 0,
      averageRating: 0,
      distribution: { positive: 0, neutral: 0, negative: 0 },
      percentages: { positive: 0, neutral: 0, negative: 0 },
      topThemes: [],
      commonKeywords: []
    };
  }

  let totalRating = 0;
  let pos = 0, neu = 0, neg = 0;
  const keywordFreq = {};
  const themeFreq = {};

  feedbacks.forEach(f => {
    totalRating += f.rating || 0;
    const label = f.sentiment?.label || 'neutral';
    if (label === 'positive') pos++;
    else if (label === 'negative') neg++;
    else neu++;

    (f.sentiment?.keywords || []).forEach(kw => {
      keywordFreq[kw] = (keywordFreq[kw] || 0) + 1;
    });

    // Check themes
    const lower = (f.commentText || '').toLowerCase();
    for (const [theme, kws] of Object.entries(TOPIC_DOMAINS)) {
      if (kws.some(k => lower.includes(k))) {
        themeFreq[theme] = (themeFreq[theme] || 0) + 1;
      }
    }
  });

  const total = feedbacks.length;
  const topKeywords = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  const topThemes = Object.entries(themeFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }));

  return {
    totalFeedback: total,
    averageRating: parseFloat((totalRating / total).toFixed(2)),
    distribution: { positive: pos, neutral: neu, negative: neg },
    percentages: {
      positive: Math.round((pos / total) * 100),
      neutral: Math.round((neu / total) * 100),
      negative: Math.round((neg / total) * 100)
    },
    topThemes,
    commonKeywords: topKeywords
  };
}

module.exports = {
  analyzeSentiment,
  aggregateEventSentiment,
  TOPIC_DOMAINS
};
