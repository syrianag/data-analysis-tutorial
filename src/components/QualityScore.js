"use client"
import React from 'react'

export default function QualityScore({ score = 100 }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ background: '#F59E0B', color: '#fff', padding: 20, borderRadius: 8, minWidth: 96, textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: '700' }}>{score}</div>
        <div style={{ fontSize: 12 }}>Quality</div>
      </div>
      <div style={{ color: '#374151' }}>
        <div style={{ fontWeight: 600 }}>Overall data quality</div>
        <div style={{ color: '#6B7280' }}>A higher score indicates better completeness and consistency.</div>
      </div>
    </div>
  )
}
