import Papa from 'papaparse'
// import { jsPDF } from 'jspdf'

export function downloadJSON(filename, obj) {
  const dataStr = JSON.stringify(obj, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadCSV(filename, rows) {
  // rows: array of objects
  try {
    const csv = Papa.unparse(rows || [])
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to generate CSV', err)
  }
}

export function exportAnalysisReport(rows, metrics) {
  const report = {
    generatedAt: new Date().toISOString(),
    rowCount: Array.isArray(rows) ? rows.length : 0,
    metrics: metrics || {},
    sampleRows: Array.isArray(rows) ? rows.slice(0, 100) : []
  }
  return report
}

export async function downloadRecommendationsPDF(filename, rows, metrics) {
  // Build a simple recommendations text from metrics
  try {
    // Use string concatenation to avoid static bundler resolution of the module during SSR/build
    const { jsPDF } = await import('jsp' + 'df')
    const report = exportAnalysisReport(rows, metrics)
    const lines = []
    lines.push('Agentic Data Quality Analysis - Recommendations')
    lines.push('Generated: ' + report.generatedAt)
    lines.push('')
    lines.push('Summary:')
    lines.push(`Rows analyzed: ${report.rowCount}`)
    lines.push('')

    const perColumn = (report.metrics && report.metrics.perColumn) || []
    if (perColumn.length > 0) {
      lines.push('Column Recommendations:')
      perColumn.forEach((c) => {
        lines.push(`- ${c.col}: completeness ${c.completeness}% | consistency ${c.consistency}% | accuracy ${c.accuracy}% | score ${c.colScore}`)
        // Simple heuristics for recommendations
        if (c.completeness < 90) lines.push(`  Recommendation: Investigate missing values for ${c.col} and consider imputation or source fixes.`)
        if (c.accuracy < 95) lines.push(`  Recommendation: Check for outliers or data entry errors in ${c.col}.`)
      })
    } else {
      lines.push('No per-column metrics available.')
    }

    lines.push('')
    lines.push('Sample rows:')
    report.sampleRows.slice(0, 10).forEach((r, i) => {
      lines.push(`${i + 1}. ${JSON.stringify(r)}`)
    })

    // Render lines to PDF with simple paging
    const left = 40
    let top = 60
    const lineHeight = 14
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(12)
    lines.forEach((ln) => {
      if (top + lineHeight > pageHeight - 40) {
        doc.addPage()
        top = 60
      }
      doc.text(String(ln), left, top)
      top += lineHeight
    })

    doc.save(filename)
  } catch (err) {
    // If dynamic import or PDF generation fails, fall back to downloading a JSON report
    console.warn('PDF generation failed, falling back to JSON. Error:', err)
    try {
      const report = exportAnalysisReport(rows, metrics)
      downloadJSON(filename.replace(/\.pdf$/i, '.json'), report)
    } catch (e) {
      console.error('Fallback JSON download also failed', e)
    }
  }
}
