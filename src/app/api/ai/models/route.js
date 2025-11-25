import { NextResponse } from 'next/server'

// GET /api/ai/models
// Returns a simple JSON list of allowed AI models. Driven by env var AI_ALLOWED_MODELS
export async function GET() {
  const raw = process.env.AI_ALLOWED_MODELS || 'gpt-4o-mini,gpt-4o,gpt-4o-mini-2024'
  const models = raw.split(',').map((s) => s.trim()).filter(Boolean)
  return NextResponse.json({ models })
}
