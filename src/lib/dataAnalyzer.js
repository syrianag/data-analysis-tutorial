// Simple data analysis utilities for Milestone 2

function isIntegerString(v) {
  return /^-?\d+$/.test(String(v))
}

function isFloatString(v) {
  return /^-?\d*\.\d+$/.test(String(v))
}

function tryParseDate(v) {
  const d = new Date(v)
  return !isNaN(d.getTime())
}

export function analyzeRows(rows = []) {
  if (!rows || rows.length === 0) return { columns: [], rowCount: 0 }
  const rowCount = rows.length
  const columns = Object.keys(rows[0])
  const colStats = columns.map((col) => {
    const values = rows.map((r) => r[col])
    const missing = values.filter((v) => v === null || v === undefined || String(v).trim() === '').length
    const uniques = new Set(values.map((v) => (v === null || v === undefined ? '__NULL__' : String(v)))).size
    const duplicates = rowCount - uniques

    // type inference (simple)
    let intCount = 0
    let floatCount = 0
    let dateCount = 0
    let boolCount = 0
    let textCount = 0

    values.forEach((v) => {
      if (v === null || v === undefined || String(v).trim() === '') return
      const s = String(v)
      if (s.toLowerCase() === 'true' || s.toLowerCase() === 'false') {
        boolCount++
      } else if (isIntegerString(s)) {
        intCount++
      } else if (isFloatString(s)) {
        floatCount++
      } else if (tryParseDate(s)) {
        dateCount++
      } else {
        textCount++
      }
    })

    let inferredType = 'text'
    if (intCount + floatCount > 0 && textCount === 0 && dateCount === 0) {
      inferredType = floatCount > 0 ? 'float' : 'integer'
    } else if (dateCount > 0 && textCount === 0) {
      inferredType = 'date'
    } else if (boolCount > 0 && textCount === 0) {
      inferredType = 'boolean'
    }

    // basic outlier detection for numeric types (z-score)
    let outliers = 0
    if (inferredType === 'integer' || inferredType === 'float') {
      const nums = values
        .map((v) => {
          const n = Number(v)
          return Number.isFinite(n) ? n : null
        })
        .filter((v) => v !== null)
      if (nums.length > 1) {
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length
        const sd = Math.sqrt(nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length)
        if (sd > 0) {
          outliers = nums.filter((n) => Math.abs((n - mean) / sd) > 3).length
        }
      }
    }

    return {
      col,
      missing,
      uniques,
      duplicates,
      inferredType,
      outliers
    }
  })

  return { rowCount, columns: colStats }
}

export function computeQualityScore(rows = []) {
  const analysis = analyzeRows(rows)
  if (!analysis.columns || analysis.columns.length === 0) return { score: 100, metrics: {} }
  const rowCount = analysis.rowCount
  const colScores = analysis.columns.map((c) => {
    const completeness = Math.round(((rowCount - c.missing) / rowCount) * 100)
    // consistency: if inferred type is not text, we treat consistency higher
    const consistency = c.inferredType === 'text' ? 80 : 95
    const accuracy = rowCount > 0 ? Math.round(((rowCount - c.outliers) / rowCount) * 100) : 100
    const colScore = Math.round((completeness * 0.5 + consistency * 0.25 + accuracy * 0.25))
    return { col: c.col, completeness, consistency, accuracy, colScore }
  })

  const overall = Math.round(colScores.reduce((a, b) => a + b.colScore, 0) / colScores.length)

  const metrics = { perColumn: colScores }
  return { score: overall, metrics }
}

export default { analyzeRows, computeQualityScore }
