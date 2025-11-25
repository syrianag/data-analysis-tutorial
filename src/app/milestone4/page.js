"use client"
import { useEffect, useState } from 'react'
import { loadAnalysis, saveAnalysis } from '../../lib/sessionStore'
import ColumnDetail from '../../components/ColumnDetail'
import DataPreview from '../../components/DataPreview'
import { computeQualityScore, analyzeRows } from '../../lib/dataAnalyzer'

export default function Milestone4Page() {
  const [rows, setRows] = useState([])
  const [metrics, setMetrics] = useState({ perColumn: [] })
  const [activeColumn, setActiveColumn] = useState(null)

  useEffect(() => {
    const stored = loadAnalysis()
    if (stored && stored.rows && stored.rows.length) {
      setRows(stored.rows)
      setMetrics(stored.metrics || {})
    }
  }, [])

  function onApply(newRows) {
    const q = computeQualityScore(newRows || [])
    setRows(newRows)
    setMetrics(q.metrics || {})
    saveAnalysis({ rows: newRows, metrics: q.metrics })
    setActiveColumn(null)
  }

  const analysis = analyzeRows(rows || [])

  function issuesForCol(colName) {
    const col = analysis.columns.find((c) => c.col === colName) || {}
    const issues = []
    if ((col.missing || 0) > 0) issues.push(`${col.missing} missing`)
    if ((col.outliers || 0) > 0) issues.push(`${col.outliers} outlier(s)`)
    if ((col.duplicates || 0) > 0) issues.push(`${col.duplicates} duplicate(s)`)
    return { col, issues }
  }

  return (
    <div>
      <h1>Detailed Insights</h1>
      <p>Per-column detailed insights and suggested fixes.</p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
        <div style={{ flex: 1, minWidth: 420 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Data Preview</h3>
            <DataPreview rows={rows} onColumnClick={(c) => setActiveColumn(c)} />
          </div>

          {activeColumn && (
            <ColumnDetail column={activeColumn} rows={rows} onApply={onApply} onClose={() => setActiveColumn(null)} />
          )}
        </div>

        <div style={{ width: 420, minWidth: 320 }}>
          {analysis.columns && analysis.columns.length > 0 ? (
            analysis.columns.map((c) => {
              const { col, issues } = issuesForCol(c.col)
              const hasIssues = issues && issues.length > 0
              return (
                <div key={c.col} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: hasIssues ? 'linear-gradient(90deg, rgba(59,130,246,0.08), rgba(5,150,105,0.03))' : 'linear-gradient(90deg, rgba(5,150,105,0.06), rgba(59,130,246,0.02))' }}>
                    <div>
                      <strong style={{ color: 'var(--primary-700)' }}>Column: {c.col} ({c.inferredType})</strong>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{hasIssues ? `${issues.length} Issues Found` : 'No Issues ✓'}</div>
                    </div>
                    <div>
                      <button onClick={() => setActiveColumn(c.col)} style={{ padding: '6px 10px', background: hasIssues ? 'var(--primary-600)' : 'var(--accent-600)', color: '#fff', border: 'none', borderRadius: 6 }}>{hasIssues ? 'Inspect' : 'View'}</button>
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Analysis Details:</div>
                    <div style={{ background: '#fff', border: '1px solid var(--border)', padding: 10, borderRadius: 6 }}>
                      <div>Type: <strong>{c.inferredType}</strong></div>
                      <div>Missing Values: <strong>{c.missing}</strong> out of {analysis.rowCount} ({Math.round(((c.missing||0)/Math.max(1,analysis.rowCount))*100)}%)</div>
                      <div>Unique Values: <strong>{c.uniques}</strong></div>
                      <div>Duplicates: <strong>{c.duplicates}</strong></div>
                      {c.outliers ? <div>Outliers: <strong>{c.outliers}</strong></div> : null}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>Suggested Fixes:</div>
                      <ol style={{ margin: 0 }}>
                        <li>Fill missing values with <code>"Unknown"</code> or use imputation.</li>
                        <li>Standardize formatting (e.g., Title Case) where appropriate.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="card">No columns found in dataset. Upload data on the left.</div>
          )}
        </div>
      </div>
    </div>
  )
}
