import { describe, it, expect } from 'vitest'
import { removeDuplicatesByColumn, imputeMissing } from '../dataUtils'

describe('dataUtils', () => {
  it('removes duplicate rows by column (keeps first)', () => {
    const rows = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '1', name: 'A' },
      { id: '3', name: 'C' }
    ]
    const out = removeDuplicatesByColumn(rows, 'id')
    expect(out.length).toBe(3)
    expect(out.find((r) => r.id === '1')).toEqual({ id: '1', name: 'A' })
  })

  it('imputes missing values for a column', () => {
    const rows = [
      { id: '1', city: '' },
      { id: '2', city: null },
      { id: '3', city: 'NY' }
    ]
    const out = imputeMissing(rows, 'city', 'Unknown')
    expect(out[0].city).toBe('Unknown')
    expect(out[1].city).toBe('Unknown')
    expect(out[2].city).toBe('NY')
  })
})
