"use client"
import { useState } from 'react'
import FileUpload from '../../components/FileUpload'
import DataPreview from '../../components/DataPreview'
import ColumnDetail from '../../components/ColumnDetail'
import QualityScore from '../../components/QualityScore'
import DataVisualizations from '../../components/DataVisualizations'
import { computeQualityScore } from '../../lib/dataAnalyzer'
import { downloadCSV, downloadJSON, exportAnalysisReport } from '../../lib/reportExporter'

export default function AnalysisPage() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)

  const handleData = (data, meta) => {
    setRows(data)
    setMeta(meta)
  }

  const { score, metrics } = rows && rows.length ? computeQualityScore(rows) : { score: 100, metrics: { perColumn: [] } }
  const [selectedColumn, setSelectedColumn] = useState(null)

  return (
    <section style={{ padding: 20 }}>
      <h1>Analysis Page</h1>
      <p>Upload a dataset here to view analysis and download reports.</p>

      <div style={{ margin: '20px 0' }}>
        <FileUpload onData={handleData} />
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Preview</h2>
        <DataPreview rows={rows} onColumnClick={(col) => setSelectedColumn(col)} />
        {selectedColumn && (
          <ColumnDetail
            column={selectedColumn}
            rows={rows}
            onApply={(newRows) => {
              setRows(newRows)
              setSelectedColumn(null)
            }}
            onClose={() => setSelectedColumn(null)}
          />
        )}
      </div>

      {rows && rows.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2>Analysis</h2>
          <div style={{ marginBottom: 12 }}>
            <QualityScore score={score} />
          </div>
          <div style={{ marginTop: 12 }}>
            <DataVisualizations metrics={metrics} />
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button
              onClick={() => downloadCSV('analysis-data.csv', rows)}
              style={{ padding: '8px 12px', background: '#10B981', color: '#fff', borderRadius: 6, border: 'none' }}
            >
              Download Data (CSV)
            </button>
            <button
              onClick={() => {
                const report = exportAnalysisReport(rows, metrics)
                downloadJSON('analysis-report.json', report)
              }}
              style={{ padding: '8px 12px', background: '#6B7280', color: '#fff', borderRadius: 6, border: 'none' }}
            >
              Download Report (JSON)
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
