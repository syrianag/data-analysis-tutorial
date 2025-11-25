"use client"
import React from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Register chart.js elements used by Bar and Pie charts. The Pie chart requires ArcElement.
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function DataVisualizations({ metrics = { perColumn: [] } }) {
  const labels = metrics.perColumn.map((p) => p.col)
  const completeness = metrics.perColumn.map((p) => p.completeness)
  const consistency = metrics.perColumn.map((p) => p.consistency)

  // overall completeness vs missing
  const overall = (() => {
    const per = metrics.perColumn || []
    if (per.length === 0) return { present: 0, missing: 0 }
    const avg = Math.round(per.reduce((s, p) => s + p.completeness, 0) / per.length)
    return { present: avg, missing: 100 - avg }
  })()

  const data = {
    labels,
    datasets: [
      {
        label: 'Completeness',
        data: completeness,
        backgroundColor: 'rgba(59,130,246,0.7)'
      },
      {
        label: 'Consistency',
        data: consistency,
        backgroundColor: 'rgba(16,185,129,0.7)'
      }
    ]
  }

  return (
    <div style={{ maxWidth: 900, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <Bar data={data} />
      </div>
      <div style={{ width: 220 }}>
        <h4 style={{ marginTop: 0 }}>Overall completeness</h4>
        <Pie data={{ labels: ['Present', 'Missing'], datasets: [{ data: [overall.present, overall.missing], backgroundColor: ['#3B82F6', '#059669'] }] }} />
      </div>
    </div>
  )
}
