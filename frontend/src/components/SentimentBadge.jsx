import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

const SentimentBadge = ({ label = 'neutral', score = null, showScore = false }) => {
  const normalized = (label || '').toLowerCase();

  if (normalized === 'positive') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <Smile className="w-3.5 h-3.5 text-emerald-600" />
        <span>Positive</span>
        {showScore && score !== null && <span className="opacity-75">({score > 0 ? `+${score}` : score})</span>}
      </span>
    );
  }

  if (normalized === 'negative') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
        <Frown className="w-3.5 h-3.5 text-rose-600" />
        <span>Negative</span>
        {showScore && score !== null && <span className="opacity-75">({score})</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
      <Meh className="w-3.5 h-3.5 text-slate-500" />
      <span>Neutral</span>
      {showScore && score !== null && <span className="opacity-75">({score})</span>}
    </span>
  );
};

export default SentimentBadge;
