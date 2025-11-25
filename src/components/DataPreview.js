"use client"
import React from 'react'

function HeadRow({ columns }) {
  return (
    <thead>
      <tr>
        {columns.map((c) => (
          <th key={c} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #E5E7EB' }}>{c}</th>
        ))}
      </tr>
    </thead>
  )
}

export default function DataPreview({ rows = [], onColumnClick, previewCount = 10 }) {
  if (!rows || rows.length === 0) {
    return <div style={{ color: '#6B7280' }}>No data to preview</div>
  }

  const columns = Object.keys(rows[0])
  const previewRows = rows.slice(0, previewCount)

  // simple stats: missing counts per column
  const stats = columns.map((col) => {
    const missing = rows.reduce((acc, r) => (r[col] === null || r[col] === undefined || r[col] === '' ? acc + 1 : acc), 0)
    const uniques = new Set(rows.map((r) => (r[col] === null || r[col] === undefined ? '__NULL__' : String(r[col])))).size
    const duplicates = rows.length - uniques
    return { col, missing, duplicates }
  })

  return (
    <div>
      <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: 6 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #E5E7EB' }}>
                  <button onClick={() => onColumnClick && onColumnClick(c)} style={{ background: 'none', border: 'none', padding: 0, color: '#2563EB', cursor: 'pointer' }}>{c}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c} style={{ padding: '6px 8px', borderBottom: '1px solid #F3F4F6' }}>{String(r[c] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Column statistics</h3>
        <ul>
          {stats.map((s) => (
            <li key={s.col} style={{ color: '#374151' }}>
              <button onClick={() => onColumnClick && onColumnClick(s.col)} style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', padding: 0 }}>
                {s.col}:
              </button>{' '}
              {s.missing} missing{', '}{s.duplicates} duplicate(s)
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
