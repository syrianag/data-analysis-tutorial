"use client"
import { useState, useEffect } from 'react'
import { generateInsights } from '../lib/aiClient'
import { downloadCSV, downloadJSON, exportAnalysisReport, downloadRecommendationsPDF } from '../lib/reportExporter'
import ChatAI from './ChatAI'

export default function AIInsights({ rows, metrics }) {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [promptStyle, setPromptStyle] = useState('bullets')
  const [model, setModel] = useState('gpt-4o-mini')
  const [models, setModels] = useState(['gpt-4o-mini', 'gpt-4o', 'gpt-4o-mini-2024'])

  async function run() {
    setLoading(true)
    const out = await generateInsights(rows, metrics, { promptStyle, model })
    setText(out)
    setLoading(false)
  }

  useEffect(() => {
    let mounted = true
    fetch('/api/ai/models')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted) return
        if (data && Array.isArray(data.models) && data.models.length) {
          setModels(data.models)
          if (!data.models.includes(model)) setModel(data.models[0])
        }
      })
      .catch((err) => {
        console.warn('Unable to fetch allowed models from server, using defaults', err)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={run} style={{ padding: '8px 12px', background: '#2563EB', color: '#fff', borderRadius: 6, border: 'none' }}>
          {loading ? 'Running...' : 'Generate AI Insights'}
        </button>
        <select value={promptStyle} onChange={(e) => setPromptStyle(e.target.value)} style={{ padding: '6px', borderRadius: 6 }}>
          <option value="bullets">Bullets</option>
          <option value="numbered">Numbered steps</option>
        </select>
        <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: '6px', borderRadius: 6 }}>
          {models && models.length > 0 ? (
            models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))
          ) : (
            <>
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-4o">gpt-4o</option>
            </>
          )}
        </select>
        <button
          onClick={() => {
            // download raw rows as CSV
            downloadCSV('analysis-data.csv', rows || [])
          }}
          style={{ padding: '8px 12px', background: '#10B981', color: '#fff', borderRadius: 6, border: 'none' }}
        >
          Download Data (CSV)
        </button>
        <button
          onClick={() => {
            // generate report object and download as JSON
            const report = exportAnalysisReport(rows, metrics)
            downloadJSON('analysis-report.json', report)
          }}
          style={{ padding: '8px 12px', background: '#6B7280', color: '#fff', borderRadius: 6, border: 'none' }}
        >
          Download Report (JSON)
        </button>
        <button
          onClick={() => {
            // generate a recommendations PDF from the analysis
            downloadRecommendationsPDF('analysis-recommendations.pdf', rows, metrics)
          }}
          style={{ padding: '8px 12px', background: '#8B5CF6', color: '#fff', borderRadius: 6, border: 'none' }}
        >
          Download Recommendations (PDF)
        </button>
      </div>
      {/* Simple chat widget for ad-hoc questions about the analysis. */}
      <ChatAI defaultModel={model} systemPrompt={`You are a helpful assistant that explains data analysis findings in ${promptStyle} style.`} />
      {text && (
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12, background: '#F3F4F6', padding: 12, borderRadius: 6 }}>{text}</pre>
      )}
    </div>
  )
}
