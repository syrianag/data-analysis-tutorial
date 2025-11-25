"use client"
import Link from 'next/link'

export default function Home() {
  const cards = [
  { id: 1, title: 'Data Upload', href: '/milestone1', desc: 'Upload datasets and start an analysis.' },
  { id: 2, title: 'Data Preview', href: '/milestone2', desc: 'Preview rows, inspect column stats and start fixes.' },
  { id: 3, title: 'Data Analysis', href: '/milestone3', desc: 'Dashboard with score, visualizations and AI insights.' },
  { id: 4, title: 'Results', href: '/milestone4', desc: 'Per-column detail view: dedupe, impute and apply fixes.' }
  ]

  return (
    <section>
      <h1>Project Milestones</h1>
      <p>Select a milestone to open its page and continue your workflow.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 18 }}>
        {cards.map((c) => (
          <Link key={c.id} href={c.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--primary-900)', marginBottom: 6 }}>{c.title}</div>
                <div style={{ color: 'var(--muted)' }}>{c.desc}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary">Open</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
