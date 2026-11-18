/**
 * EventNest Recommendation Engine
 * Content-Based Filtering using TF-IDF (Term Frequency-Inverse Document Frequency)
 * and Cosine Similarity matching Student Profiles to Event Feature Vectors.
 * 
 * Based on research references cited in the EventNest Synopsis:
 * - D. Herzog and W. Wörndl (2016)
 * - T. Trinh, D. Wu, R. Wang and J. Z. Huang (2020)
 * - H. Khoo Shien Chen and S. Rathina Velu (2023)
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in',
  'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves', 'event', 'college', 'campus', 'student', 'session', 'held', 'participate'
]);

// Tokenize text into normalized words excluding punctuation and stopwords
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// Compute Term Frequency (TF) for a document
function computeTF(tokens) {
  const tf = {};
  if (!tokens || tokens.length === 0) return tf;
  
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  
  // Normalize by total tokens
  for (const token in tf) {
    tf[token] = tf[token] / tokens.length;
  }
  return tf;
}

// Compute Inverse Document Frequency (IDF) over the corpus of documents
function computeIDF(corpusTokensList) {
  const N = corpusTokensList.length;
  const idf = {};
  const docOccurrences = {};

  for (const docTokens of corpusTokensList) {
    const uniqueTokens = new Set(docTokens);
    for (const token of uniqueTokens) {
      docOccurrences[token] = (docOccurrences[token] || 0) + 1;
    }
  }

  for (const token in docOccurrences) {
    // Smooth IDF formula: ln((1 + N) / (1 + df)) + 1
    idf[token] = Math.log((1 + N) / (1 + docOccurrences[token])) + 1;
  }

  return idf;
}

// Convert tokens to TF-IDF vector against vocabulary IDF
function computeTFIDFVector(tokens, idf) {
  const tf = computeTF(tokens);
  const vector = {};
  for (const token in tf) {
    if (idf[token]) {
      vector[token] = tf[token] * idf[token];
    }
  }
  return vector;
}

// Compute Cosine Similarity between two sparse vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key in vecA) {
    normA += vecA[key] * vecA[key];
    if (vecB[key]) {
      dotProduct += vecA[key] * vecB[key];
    }
  }

  for (const key in vecB) {
    normB += vecB[key] * vecB[key];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generate Event Profile text
 */
function buildEventDocument(event) {
  const categoryWeight = `${event.category} `.repeat(3);
  const tagsWeight = (event.tags || []).join(' ') + ' ' + (event.tags || []).join(' ');
  const titleWeight = `${event.title} `.repeat(2);
  const description = event.description || '';
  return `${titleWeight} ${categoryWeight} ${tagsWeight} ${description}`;
}

/**
 * Generate Student Profile text combining explicit interests, department,
 * and historical participation.
 */
function buildStudentProfileDocument(user, pastEvents = []) {
  const interests = (user.interests || []).join(' ');
  const interestsWeight = `${interests} `.repeat(4);
  const deptWeight = user.department ? `${user.department} `.repeat(2) : '';
  
  let pastHistory = '';
  if (pastEvents.length > 0) {
    pastHistory = pastEvents
      .map(e => `${e.category} ${(e.tags || []).join(' ')} ${e.title}`)
      .join(' ');
  }

  return `${interestsWeight} ${deptWeight} ${pastHistory}`;
}

/**
 * Recommend events for a given student
 * @param {Object} user - Student user object
 * @param {Array} allEvents - Available upcoming events
 * @param {Array} pastRegisteredEvents - Events previously attended/registered
 * @param {Number} limit - Max recommendations to return
 */
function getPersonalizedRecommendations(user, allEvents, pastRegisteredEvents = [], limit = 6) {
  if (!allEvents || allEvents.length === 0) return [];

  // Exclude events already registered or attended by the student
  const registeredEventIds = new Set(pastRegisteredEvents.map(e => e._id.toString()));
  const candidateEvents = allEvents.filter(e => !registeredEventIds.has(e._id.toString()));

  if (candidateEvents.length === 0) return [];

  // Build documents
  const studentDoc = buildStudentProfileDocument(user, pastRegisteredEvents);
  const studentTokens = tokenize(studentDoc);

  const eventDocs = candidateEvents.map(e => buildEventDocument(e));
  const eventTokensList = eventDocs.map(doc => tokenize(doc));

  // Compute corpus IDF
  const corpusTokens = [studentTokens, ...eventTokensList];
  const idf = computeIDF(corpusTokens);

  // Compute student vector
  const studentVector = computeTFIDFVector(studentTokens, idf);

  // Calculate similarity for each candidate event
  const scoredEvents = candidateEvents.map((event, index) => {
    const eventVector = computeTFIDFVector(eventTokensList[index], idf);
    let similarity = cosineSimilarity(studentVector, eventVector);

    // Boost if event category matches student explicit interests
    const matchesExplicitInterest = (user.interests || []).some(
      interest => event.category.toLowerCase().includes(interest.toLowerCase()) ||
                  (event.tags || []).some(t => t.toLowerCase().includes(interest.toLowerCase()))
    );

    if (matchesExplicitInterest) {
      similarity += 0.15;
    }

    // Identify shared matching keywords for UI transparency
    const matchingKeywords = [];
    const studentWords = new Set(studentTokens);
    for (const token of eventTokensList[index]) {
      if (studentWords.has(token) && !matchingKeywords.includes(token)) {
        matchingKeywords.push(token);
        if (matchingKeywords.length >= 4) break;
      }
    }

    return {
      event,
      similarityScore: Math.min(1.0, parseFloat(similarity.toFixed(4))),
      matchReasons: matchingKeywords.length > 0 
        ? matchingKeywords 
        : [event.category, ...(event.tags || []).slice(0, 2)]
    };
  });

  // Sort descending by similarity score
  scoredEvents.sort((a, b) => b.similarityScore - a.similarityScore);

  // Fallback check: if top scores are low or user has no specific interests,
  // return top upcoming events sorted by popularity and date
  return scoredEvents.slice(0, limit);
}

module.exports = {
  tokenize,
  computeTF,
  computeIDF,
  computeTFIDFVector,
  cosineSimilarity,
  getPersonalizedRecommendations
};
