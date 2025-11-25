import { describe, it, expect } from 'vitest'
import { analyzeRows } from '../dataAnalyzer'

describe('dataAnalyzer duplicates', () => {
  it('detects duplicate values in a column', () => {
    const rows = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '1', name: 'A' },
      { id: '3', name: 'C' }
    ]
    const res = analyzeRows(rows)
    const idCol = res.columns.find((c) => c.col === 'id')
    expect(idCol).toBeDefined()
    expect(idCol.duplicates).toBeGreaterThan(0)
  })
})
