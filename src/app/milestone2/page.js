"use client"
import { useEffect, useState } from 'react'
import FileUpload from '../../components/FileUpload'
import DataPreview from '../../components/DataPreview'
import { analyzeRows, computeQualityScore } from '../../lib/dataAnalyzer'
import { loadAnalysis, saveAnalysis } from '../../lib/sessionStore'
import Link from 'next/link'

export default function Milestone2Page() {
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState({})
  const [analysis, setAnalysis] = useState({ columns: [], rowCount: 0 })

  useEffect(() => {
    const stored = loadAnalysis()
    if (stored && stored.rows && stored.rows.length) {
      setRows(stored.rows)
      setMetrics(stored.metrics || {})
      setAnalysis(analyzeRows(stored.rows || []))
    }
  }, [])

  function onData(newRows) {
    const rowsArr = newRows || []
    setRows(rowsArr)
    const q = computeQualityScore(rowsArr)
    setMetrics(q.metrics || {})
    saveAnalysis({ rows: rowsArr, metrics: q.metrics })
    setAnalysis(analyzeRows(rowsArr))
  }

  const completenessPct = (() => {
    const per = (metrics && metrics.perColumn) || []
    if (!per.length) return 0
    const avg = Math.round(per.reduce((a, b) => a + (b.completeness || 0), 0) / per.length)
    return avg
  })()

  const rowCount = analysis.rowCount || (rows && rows.length) || 0

  return (
    <div>
      <h1>Data Preview</h1>
      <p>Preview the first rows of your dataset and view column statistics.</p>

      <section className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: 'var(--text)' }}>File: {rowCount > 0 ? `Uploaded dataset (${rowCount} rows)` : 'No file uploaded'}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{rowCount > 0 ? `${rowCount} rows detected` : ''}</div>
        </div>

        {/* analyzing progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ height: 12, background: 'var(--card)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ width: `${completenessPct}%`, height: '100%', background: 'linear-gradient(90deg,var(--primary-500),var(--primary-700))' }} />
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)' }}>Analyzing… {completenessPct}%</div>
        </div>

        {rows && rows.length > 0 ? (
          <div>
            <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 8 }}>Data Preview (First 100 rows):</div>
            <DataPreview rows={rows} previewCount={100} onColumnClick={(col) => (window.location.href = '/milestone4')} />

            <div style={{ marginTop: 12 }}>
              <h3 style={{ marginTop: 0 }}>Column Statistics</h3>
              <div className="card" style={{ background: 'var(--card)' }}>
                {analysis.columns && analysis.columns.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {analysis.columns.map((c) => (
                      <li key={c.col} style={{ marginBottom: 6 }}>
                        <strong style={{ color: 'var(--primary-700)' }}>{c.col}</strong>: {c.inferredType}, {c.uniques} unique, {c.missing} missing{c.outliers ? `, ${c.outliers} outlier(s)` : ''}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: 'var(--muted)' }}>No column stats available.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--muted)' }}>No dataset uploaded yet. Use the upload above or go to <Link href="/milestone1">Data Upload</Link>.</div>
        )}

        <div style={{ marginTop: 12 }}>
          <Link href="/milestone3" className="btn btn-primary">Continue to Full Analysis →</Link>
        </div>
      </section>

      <section style={{ marginTop: 12 }}>
        <div className="muted-card" style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Initial Quality Overview</h3>
          <div style={{ fontSize: 14, color: 'var(--text)' }}>
            <div>Schema detected: {analysis.columns ? `${analysis.columns.length} columns identified` : '—'}</div>
            <div>Data types inferred: {analysis.columns ? (Array.from(new Set(analysis.columns.map((c) => c.inferredType))).join(', ') || '—') : '—'}</div>
            <div>Null values found: {analysis.columns ? analysis.columns.reduce((a, b) => a + (b.missing || 0), 0) : 0} total across {analysis.columns ? analysis.columns.filter((c) => c.missing > 0).length : 0} columns</div>
            <div>Potential issues: {analysis.columns && analysis.columns.some((c) => c.outliers > 0) ? `outliers detected in ${analysis.columns.filter((c) => c.outliers > 0).map((c) => c.col).join(', ')}` : 'none detected'}</div>
          </div>
        </div>
      </section>
    </div>
  )
}
