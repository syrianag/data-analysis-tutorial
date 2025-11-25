"use client"
import React, { useState } from 'react'

// Simple chat component that posts messages to the Next.js API at /api/ai/generate
// Best practice: client sends content to a server-side API route that holds the
// OPENAI_API_KEY and performs the provider call. The server should return a
// JSON response similar to OpenAI's chat response (data.choices[0].message.content).

export default function ChatAI({ defaultModel = 'gpt-4o-mini', systemPrompt = 'You are a helpful assistant.' }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input || !input.trim()) return
    const trimmed = input.trim()
    const userMsg = { sender: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: trimmed }
          ]
        })
      })

      if (!res.ok) {
        // Try to parse error body for message, but fallback to generic message
        let errText = `AI server returned ${res.status}`
        try {
          const errBody = await res.json()
          if (errBody && errBody.error && errBody.error.message) errText = errBody.error.message
        } catch (e) {
          // ignore parse error
        }
        setMessages((prev) => [...prev, { sender: 'ai', text: `:warning: ${errText}` }])
        return
      }

      const data = await res.json()
      const aiText = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : data && data.text // support a simple { text: "..." } fallback
          ? String(data.text).trim()
          : "Sorry, I couldn’t generate a response right now."

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }])
    } catch (error) {
      console.error('AI Error:', error)
      setMessages((prev) => [...prev, { sender: 'ai', text: ':warning: Unable to reach the AI right now.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ border: '1px solid #E5E7EB', padding: 12, borderRadius: 8, maxWidth: 780 }}>
        <div style={{ maxHeight: 240, overflowY: 'auto', paddingBottom: 8 }}>
          {messages.length === 0 && <div style={{ color: '#6B7280' }}>No messages yet — ask a question.</div>}
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong style={{ color: m.sender === 'user' ? '#111827' : '#065F46' }}>{m.sender === 'user' ? 'You:' : 'AI:'}</strong>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{m.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Type a question for the AI..."
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #D1D5DB' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                handleSend()
              }
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={handleSend}
              disabled={loading}
              style={{ padding: '8px 12px', background: '#2563EB', color: '#fff', borderRadius: 6, border: 'none' }}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
