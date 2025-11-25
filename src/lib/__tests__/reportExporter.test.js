import { describe, test, expect } from 'vitest'
import { exportAnalysisReport } from '../reportExporter'

describe('reportExporter', () => {
  test('exportAnalysisReport returns expected keys', () => {
    const rows = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' }
    ]
    const metrics = { perColumn: [{ col: 'id', completeness: 100 }] }
    const r = exportAnalysisReport(rows, metrics)
    expect(r).toHaveProperty('generatedAt')
    expect(r).toHaveProperty('rowCount', 2)
    expect(r).toHaveProperty('metrics')
    expect(Array.isArray(r.sampleRows)).toBe(true)
  })
})
