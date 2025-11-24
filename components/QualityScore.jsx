import { AlertCircle } from 'lucide-react';

export function QualityScore({ scores }) {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-300 shadow-[3px_3px_0px_#cbd5e1]">
      <h2 className="text-lg font-semibold mb-4 text-slate-700">Quality Score:</h2>

      <div className="space-y-5">
        <ScoreItemDisplay
          label="Completeness:"
          score={scores.completeness.score}
          issues={scores.completeness.issues}
        />

        <ScoreItemDisplay
          label="Consistency:"
          score={scores.consistency.score}
          issues={scores.consistency.issues}
        />

        <ScoreItemDisplay
          label="Accuracy:"
          score={scores.accuracy.score}
          issues={scores.accuracy.issues}
        />
      </div>
    </div>
  );
}

function ScoreItemDisplay({ label, score, issues }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-medium text-slate-700 min-w-[110px]">{label}</span>

        <div className="flex-1 bg-slate-200 rounded-full h-6 overflow-hidden border border-slate-300">
          <div
            className="bg-slate-800 h-full flex items-center justify-end pr-2"
            style={{ width: `${score}%` }}
          >
            <span className="text-white text-xs font-bold">{score}%</span>
          </div>
        </div>
      </div>

      {issues.map((issue, idx) => (
        <div key={idx} className="flex items-start gap-2 ml-4 text-sm text-slate-600">
          <span className="text-slate-400">•</span>
          <span>{issue}</span>
        </div>
      ))}
    </div>
  );
}
