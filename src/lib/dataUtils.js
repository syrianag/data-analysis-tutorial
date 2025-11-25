// Small data utilities used by the ColumnDetail UI

export function removeDuplicatesByColumn(rows = [], column) {
  if (!Array.isArray(rows) || !column) return rows
  const seen = new Set()
  const out = []
  for (const r of rows) {
    const key = r && r[column] !== undefined && r[column] !== null ? String(r[column]) : '__NULL__'
    if (!seen.has(key)) {
      seen.add(key)
      out.push(r)
    }
  }
  return out
}

export function imputeMissing(rows = [], column, value) {
  if (!Array.isArray(rows) || !column) return rows
  return rows.map((r) => {
    const v = r[column]
    if (v === null || v === undefined || String(v).trim() === '') {
      return { ...r, [column]: value }
    }
    return r
  })
}

export default { removeDuplicatesByColumn, imputeMissing }
