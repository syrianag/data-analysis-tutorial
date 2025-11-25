"use client"
import { useCallback, useState } from 'react'
import Papa from 'papaparse'
import { parseFileFromInput } from '../lib/fileProcessing'

export default function FileUpload({ onData }) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (file) => {
      if (!file) return
      // Use fileProcessing service which supports csv/json/xlsx
      parseFileFromInput(file)
        .then(({ rows, meta }) => {
          onData && onData(rows, meta)
        })
        .catch((err) => {
          console.error('Failed to parse file', err)
          // show a simple alert to the user for now
          alert('Failed to parse file: ' + (err && err.message ? err.message : String(err)))
        })
    },
    [onData]
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFiles(file)
  }

  const onChange = (e) => {
    const file = e.target.files[0]
    handleFiles(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: '2px dashed #9CA3AF',
          borderRadius: 8,
          padding: 32,
          textAlign: 'center',
          background: dragOver ? '#f3f4f6' : 'transparent',
          cursor: 'pointer'
        }}
        role="button"
      >
        <p style={{ margin: 0, color: '#374151' }}>Drag & drop a CSV here</p>
        <p style={{ marginTop: 8, color: '#6B7280' }}>or</p>
        <label style={{ cursor: 'pointer', color: '#2563EB' }}>
          <input
            type="file"
            accept={(process.env.NEXT_PUBLIC_SUPPORTED_FORMATS || 'csv').split(',').map((s) => (s.trim() === 'csv' ? '.csv' : s.trim())).join(',')}
            onChange={onChange}
            style={{ display: 'none' }}
          />
          Choose file
        </label>
      </div>
    </div>
  )
}
