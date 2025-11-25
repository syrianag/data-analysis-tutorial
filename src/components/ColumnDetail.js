"use client"
import { useMemo, useState } from 'react'
import { removeDuplicatesByColumn, imputeMissing } from '../lib/dataUtils'

export default function ColumnDetail({ column, rows = [], onApply, onClose }) {
  const [imputeValue, setImputeValue] = useState('')
  const [removeDups, setRemoveDups] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const colValues = useMemo(() => rows.map((r, i) => ({ index: i, value: r[column] })), [rows, column])

  const missing = useMemo(() => colValues.filter((c) => c.value === null || c.value === undefined || String(c.value).trim() === '').length, [colValues])
  const uniques = useMemo(() => new Set(colValues.map((c) => (c.value === null || c.value === undefined ? '__NULL__' : String(c.value)))).size, [colValues])
  const duplicatesCount = rows.length - uniques

  function prepareApply() {
    // Enter confirmation step
    setConfirming(true)
  }

  function doApply() {
    let out = rows.slice()
    if (removeDups) {
      out = removeDuplicatesByColumn(out, column)
    }
    if (imputeValue && String(imputeValue).trim() !== '') {
      out = imputeMissing(out, column, imputeValue)
    }
    setConfirming(false)
    onApply && onApply(out)
  }

  function cancelConfirm() {
    setConfirming(false)
  }

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div style={{ width: 'min(960px, 96%)', background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', position: 'relative', zIndex: 70 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{column} — Details</h3>
          <div>
            <button onClick={onClose} style={{ marginLeft: 8 }}>Close</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div>Rows: {rows.length}</div>
          <div>Missing: {missing}</div>
          <div>Duplicates: {duplicatesCount}</div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input data-testid="remove-dups" type="checkbox" checked={removeDups} onChange={(e) => setRemoveDups(e.target.checked)} /> Remove duplicates (keep first)
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Impute missing with:
            <input data-testid="impute-input" value={imputeValue} onChange={(e) => setImputeValue(e.target.value)} style={{ marginLeft: 8 }} />
          </label>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button data-testid="apply-btn" onClick={prepareApply} style={{ padding: '6px 10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 6 }}>Apply changes</button>
          <button data-testid="cancel-btn" onClick={() => { onApply && onApply(rows) }} style={{ padding: '6px 10px' }}>Cancel changes</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <h4 style={{ marginBottom: 8 }}>Sample values</h4>
          <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid #F3F4F6', padding: 8 }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {colValues.slice(0, 50).map((v) => (
                <li key={v.index} style={{ fontFamily: 'monospace' }}>{String(v.value ?? '')}</li>
              ))}
            </ul>
          </div>
        </div>

        {confirming && (
          <div role="alertdialog" aria-modal="true" style={{ marginTop: 12, borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
            <p>Confirm apply changes? This will modify the dataset in memory.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button data-testid="confirm-yes" onClick={doApply} style={{ padding: '6px 10px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6 }}>Yes, apply</button>
              <button data-testid="confirm-no" onClick={cancelConfirm} style={{ padding: '6px 10px' }}>No, cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
