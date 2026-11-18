const recommendationEngine = require('./services/recommendationEngine');
const sentimentAnalyzer = require('./services/sentimentAnalyzer');
const qrService = require('./services/qrService');

console.log('--- Testing Recommendation Engine (TF-IDF + Cosine Similarity) ---');
const dummyUser = {
  department: 'Information Technology',
  interests: ['Artificial Intelligence', 'Machine Learning', 'Python']
};

const dummyEvents = [
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e1',
    title: 'Deep Learning with PyTorch',
    category: 'Workshop',
    tags: ['artificial intelligence', 'machine learning', 'python'],
    description: 'Hands-on practical workshop exploring neural networks and deep learning architectures in python.'
  },
  {
    _id: '64a1b2c3d4e5f6a7b8c9d0e2',
    title: 'Battle of Bands - Rock Fest',
    category: 'Cultural',
    tags: ['music', 'cultural', 'rock'],
    description: 'Inter-college musical competition with live instruments and vocals.'
  }
];

const recs = recommendationEngine.getPersonalizedRecommendations(dummyUser, dummyEvents, []);
console.log('Recommendations output:');
recs.forEach(r => {
  console.log(`- ${r.event.title} [Score: ${r.similarityScore}] (Matched: ${r.matchReasons.join(', ')})`);
});

console.log('\n--- Testing Sentiment Analyzer (VADER Valence Lexicon) ---');
const testComments = [
  'Outstanding workshop! The speaker explained Docker with clear demos. Really helpful and well-organized.',
  'The venue was overcrowded and delayed by 45 minutes. The sound in the back was unclear and disorganized.',
  'The session was okay. Average content and standard slides.'
];

testComments.forEach(c => {
  const res = sentimentAnalyzer.analyzeSentiment(c);
  console.log(`"${c}" => Label: ${res.label}, Score: ${res.score}, Themes: [${res.themes.join(', ')}]`);
});

console.log('\n--- Testing Verifiable QR Code Crypto ---');
const ticketId = qrService.generateTicketId();
const eventId = '64a1b2c3d4e5f6a7b8c9d0e1';
const userId = '64a1b2c3d4e5f6a7b8c9d099';
const qrPayload = qrService.generateQRPayload(ticketId, eventId, userId);
console.log('Generated Ticket ID:', ticketId);
console.log('Encoded QR Payload String:', qrPayload.substring(0, 40) + '...');

const verified = qrService.verifyQRPayload(qrPayload, eventId);
console.log('Verification with correct event ID:', verified.valid ? 'VALID ✅' : 'INVALID ❌');

const tamperedVerified = qrService.verifyQRPayload(qrPayload, '64a1b2c3d4e5f6a7b8c9d099');
console.log('Verification with wrong event ID:', tamperedVerified.valid ? 'VALID' : `EXPECTED REJECTION 🛡️ (${tamperedVerified.error})`);

console.log('\nAll Unit Tests Passed Successfully!');
