import { NextResponse } from 'next/server'

// POST /api/ai/generate
export async function POST(req) {
  try {
    const body = await req.json()
  const { rows, metrics, promptStyle = 'bullets', model = 'gpt-4o-mini' } = body || {}

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured on server.' }, { status: 400 })
    }

    // Build summarized sample of rows (safe-size): take up to 8 rows and truncate long values
    const sampleRows = (Array.isArray(rows) ? rows.slice(0, 8) : []).map((r) => {
      const out = {}
      Object.keys(r || {}).forEach((k) => {
        let v = r[k]
        if (v === null || v === undefined) v = ''
        const s = String(v)
        out[k] = s.length > 120 ? s.slice(0, 117) + '...' : s
      })
      return out
    })

    const perCol = (metrics && metrics.perColumn) || []
    const missingCols = perCol.filter((c) => c.completeness < 100).map((c) => `${c.col}: ${100 - c.completeness}% missing`).slice(0, 10)
    const outlierCols = perCol.filter((c) => c.accuracy < 100).map((c) => `${c.col}: ${c.outliers || 0} outliers`).slice(0, 10)

    const promptLines = []
    promptLines.push('You are a concise data quality assistant.')
    promptLines.push('Given the dataset metrics and a small sample of rows, provide actionable recommendations to improve data quality and steps to automate fixes.')
    promptLines.push(`Rows analyzed: ${Array.isArray(rows) ? rows.length : 0}`)
    if (missingCols.length > 0) promptLines.push('Columns with missing data: ' + missingCols.join(', '))
    if (outlierCols.length > 0) promptLines.push('Columns with potential outliers: ' + outlierCols.join(', '))
    promptLines.push('\nSample rows (truncated):')
    sampleRows.forEach((sr, i) => {
      const entries = Object.keys(sr).map((k) => `${k}=${sr[k]}`)
      promptLines.push(`${i + 1}. ${entries.join(', ')}`)
    })

    if (promptStyle === 'numbered') {
      promptLines.push('\nRespond with 3-6 numbered steps (1., 2., 3.) focusing on clear actions and next steps.')
    } else {
      promptLines.push('\nRespond with 3-6 short bullet points (use dashes).')
    }

    const prompt = promptLines.join('\n')

    // Validate requested model against allowed models (driven by AI_ALLOWED_MODELS env)
    const allowedRaw = process.env.AI_ALLOWED_MODELS || 'gpt-4o-mini,gpt-4o,gpt-4o-mini-2024'
    const allowedModels = allowedRaw.split(',').map((s) => s.trim()).filter(Boolean)
    const modelToUse = allowedModels.includes(model) ? model : allowedModels[0]

    // Use OpenAI SDK dynamically
    const OpenAI = await import('openai').then((m) => m.default || m)
    const client = new OpenAI({ apiKey: OPENAI_API_KEY })

    const response = await client.chat.completions.create({
      model: modelToUse,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600
    })

    const text = response.choices && response.choices[0] && response.choices[0].message ? response.choices[0].message.content : (response.choices && response.choices[0] && response.choices[0].text) || ''

    return NextResponse.json({ text })
  } catch (err) {
    console.error('AI generate error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
