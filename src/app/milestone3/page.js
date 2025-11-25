"use client"
import { useEffect, useState } from 'react'
import DataVisualizations from '../../components/DataVisualizations'
import AIInsights from '../../components/AIInsights'
import { computeQualityScore } from '../../lib/dataAnalyzer'
import { loadAnalysis } from '../../lib/sessionStore'

export default function Milestone3Page() {
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState({ perColumn: [] })

  useEffect(() => {
    const stored = loadAnalysis()
    if (stored && stored.rows && stored.rows.length) {
      setRows(stored.rows)
      setMetrics(stored.metrics || {})
    }
  }, [])

  useEffect(() => {
    if ((!metrics || !metrics.perColumn || metrics.perColumn.length === 0) && rows && rows.length) {
      const q = computeQualityScore(rows)
      setMetrics(q.metrics || {})
    }
  }, [rows])

  const score = (metrics && metrics.perColumn && metrics.perColumn.length > 0) ? Math.round(metrics.perColumn.reduce((s, p) => s + (p.colScore || 0), 0) / metrics.perColumn.length) : 0

  return (
    <div>
      <h1>Milestone 3 — Analysis Results (Dashboard)</h1>
      <p>Overview dashboard showing quality score, metrics, visualizations and AI-powered insights (follows "Analysis Results" wireframe).</p>

      <div className="metrics-box" style={{ marginTop: 12 }}>
        <div className="score-badge">{score || '—'}</div>

        <div className="panel">
          <h3>Quality Metrics</h3>
          <div>Completeness: {metrics && metrics.perColumn && metrics.perColumn.length ? metrics.perColumn[0].completeness + '%' : '—'}</div>
          <div>Consistency: {metrics && metrics.perColumn && metrics.perColumn.length ? metrics.perColumn[0].consistency + '%' : '—'}</div>
          <div>Accuracy: {metrics && metrics.perColumn && metrics.perColumn.length ? metrics.perColumn[0].accuracy + '%' : '—'}</div>
        </div>
      </div>

      <section style={{ marginTop: 16 }} className="card">
        <h3>Data Visualizations</h3>
        {rows && rows.length ? <DataVisualizations metrics={metrics} /> : <div className="chart-placeholder">No data available</div>}
      </section>

      <section style={{ marginTop: 16 }} className="insights-list">
        <h3>AI-Powered Insights</h3>
        <AIInsights rows={rows} metrics={metrics} />
      </section>
    </div>
  )
}
