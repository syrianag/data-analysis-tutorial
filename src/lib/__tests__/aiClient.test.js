import { describe, it, expect, vi } from 'vitest'
import { generateInsights } from '../aiClient'

describe('aiClient', () => {
  it('falls back to stub when server is unreachable', async () => {
    // ensure fetch throws
    const original = global.fetch
    global.fetch = vi.fn(() => { throw new Error('network') })
    const rows = [{ id: 1, name: 'A' }]
    const metrics = { perColumn: [{ col: 'id', completeness: 100 }] }
    const out = await generateInsights(rows, metrics)
    expect(typeof out).toBe('string')
    global.fetch = original
  })
})
