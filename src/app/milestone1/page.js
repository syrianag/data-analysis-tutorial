"use client"
import { useEffect, useState } from 'react'
import FileUpload from '../../components/FileUpload'
import DataPreview from '../../components/DataPreview'
import { computeQualityScore } from '../../lib/dataAnalyzer'
import { saveAnalysis, loadAnalysis } from '../../lib/sessionStore'
import Link from 'next/link'

const RECENT_KEY = 'recentAnalyses_v1'

export default function Milestone1Page() {
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState({})
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const stored = loadAnalysis()
    if (stored && stored.rows && stored.rows.length) {
      setRows(stored.rows)
      setMetrics(stored.metrics || {})
    }
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) setRecent(JSON.parse(raw))
    } catch (err) {
      // ignore
    }
  }, [])

  function saveRecentEntry(entry) {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      const arr = raw ? JSON.parse(raw) : []
      // dedupe by name and push to front
      const filtered = arr.filter((a) => a.name !== entry.name)
      const next = [entry, ...filtered].slice(0, 6)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      setRecent(next)
    } catch (err) {
      console.warn('Failed to save recent analysis', err)
    }
  }

  function onData(newRows, meta) {
    const rowsToUse = newRows || []
    setRows(rowsToUse)
    const q = computeQualityScore(rowsToUse)
    setMetrics(q.metrics || {})
    saveAnalysis({ rows: rowsToUse, metrics: q.metrics })

    // save a lightweight recent analyses entry
    const name = (meta && (meta.fileName || meta.sheetName)) || `Upload ${new Date().toLocaleString()}`
    const score = q && typeof q.score === 'number' ? q.score : null
    saveRecentEntry({ name, score, analyzedAt: new Date().toISOString() })
  }

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ marginTop: 6 }}>Upload Your Dataset</h1>
        <p style={{ marginTop: 4, marginBottom: 12, color: 'var(--muted)' }}>Instant AI-Powered Quality Analysis</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 820 }}>
            <div className="upload-drop" style={{ padding: 28 }}>
              <FileUpload onData={onData} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <Link href="/milestone2" className="btn btn-primary">Continue to Data Preview →</Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Recent Analyses</h3>
            <div className="recent-analyses">
              {recent && recent.length > 0 ? (
                recent.map((r, i) => (
                  <div key={i} style={{ padding: 8, borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>Score: {r.score ?? '—'} · Analyzed: {new Date(r.analyzedAt).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--muted)' }}>No recent analyses. Upload a file to create one.</div>
              )}
            </div>
          </div>

          {rows && rows.length > 0 && (
            <div className="card" style={{ marginTop: 12 }}>
              <h3 style={{ marginTop: 0 }}>Data Preview</h3>
              <DataPreview rows={rows} />
            </div>
          )}
        </div>

        <div style={{ width: 320, minWidth: 280 }}>
          <div className="card details-card">
            <h3 style={{ marginTop: 0 }}>Quick Tips</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Ensure column headers are in the first row.</li>
              <li>Prefer UTF-8 encoded CSV files.</li>
              <li>Remove extraneous summary rows and notes above the table.</li>
              <li>Large files may take longer — we sample up to 8 rows for AI analysis.</li>
            </ul>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Need help?</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>See the docs or contact support for assistance with tricky files (XLSX, nested JSON).</p>
          </div>
        </div>
      </div>
    </div>
  )
}
