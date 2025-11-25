// Client-side AI helper. Attempts to call server API (/api/ai/generate).
// Falls back to a lightweight local stub when the server is unavailable.
export async function generateInsights(rows, metrics, options = {}) {
  const { promptStyle = 'bullets', model = 'gpt-4o-mini' } = options || {}
  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: rows || [], metrics: metrics || {}, promptStyle, model })
    })
    if (res.ok) {
      const body = await res.json()
      if (body && body.text) return body.text
    }
  } catch (err) {
    // ignore and fall back to local stub
    console.warn('AI server call failed, falling back to stub:', err)
  }

  // Local stub fallback
  const insights = []
  if (!rows || rows.length === 0) {
    insights.push('No data available to analyze.')
  } else {
    insights.push('Top suggestions:')
    const colsWithMissing = (metrics.perColumn || []).filter((c) => c.completeness < 100).map((c) => `${c.col} (${100 - c.completeness}% missing)`)
    if (colsWithMissing.length > 0) {
      insights.push(`Address missing values in: ${colsWithMissing.join(', ')}`)
    }
    insights.push('Standardize formats for identifier columns where applicable.')
  }
  return insights.join('\n')
}

export default { generateInsights }
