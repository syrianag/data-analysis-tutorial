// File: components/analysis/AIInsights.js
import { Lightbulb } from 'lucide-react';

export function AIInsights({ recommendations }) {
  return (
    <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-300 shadow-[3px_3px_0px_#fde68a]">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h2 className="text-lg font-semibold text-slate-700">AI-Powered Insights:</h2>
      </div>

      <h3 className="font-semibold mb-4 text-slate-700">Key Recommendations:</h3>

      <div className="space-y-5">
        {recommendations.map((rec, idx) => (
          <div key={idx}>
            <div className="font-medium mb-2 text-slate-800">
              {idx + 1}. {rec.title} (Priority: {rec.priority})
            </div>

            <ul className="ml-6 space-y-1.5 text-sm text-slate-700">
              {rec.details.map((detail, detailIdx) => (
                <li key={detailIdx} className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{detail}</span>
                </li>
              ))}

              <li className="flex gap-2 italic">
                <span className="text-slate-400">•</span>
                <span>Suggestion: {rec.suggestion}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
