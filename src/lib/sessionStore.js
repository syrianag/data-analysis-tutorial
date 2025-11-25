// Simple sessionStorage-backed store for the uploaded dataset and metrics
const KEY = 'analysisData_v1'

export function saveAnalysis({ rows, metrics }) {
  try {
    const payload = { rows: rows || [], metrics: metrics || {} }
    sessionStorage.setItem(KEY, JSON.stringify(payload))
  } catch (err) {
    console.warn('Failed to save analysis to sessionStorage', err)
  }
}

export function loadAnalysis() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return { rows: [], metrics: {} }
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to load analysis from sessionStorage', err)
    return { rows: [], metrics: {} }
  }
}

export function clearAnalysis() {
  try {
    sessionStorage.removeItem(KEY)
  } catch (err) {
    // ignore
  }
}

export default { saveAnalysis, loadAnalysis, clearAnalysis }
