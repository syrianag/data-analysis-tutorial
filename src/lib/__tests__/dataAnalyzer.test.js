import { describe, it, expect } from 'vitest'
import { analyzeRows, computeQualityScore } from '../dataAnalyzer'

describe('dataAnalyzer', () => {
  const rows = [
    { id: '1', name: 'Alice', age: '30' },
    { id: '2', name: 'Bob', age: '35' },
    { id: '3', name: '', age: '' }
  ]

  it('analyzes rows and returns column stats', () => {
    const result = analyzeRows(rows)
    expect(result.rowCount).toBe(3)
    const idCol = result.columns.find((c) => c.col === 'id')
    expect(idCol).toBeDefined()
    const nameCol = result.columns.find((c) => c.col === 'name')
    expect(nameCol.missing).toBeGreaterThanOrEqual(0)
  })

  it('computes a quality score between 0 and 100', () => {
    const out = computeQualityScore(rows)
    expect(out.score).toBeGreaterThanOrEqual(0)
    expect(out.score).toBeLessThanOrEqual(100)
    expect(out.metrics.perColumn.length).toBeGreaterThan(0)
  })
})
