"use client"
import Papa from 'papaparse'

export async function parseFileFromInput(file) {
  if (!file) throw new Error('No file provided')
  const name = (file.name || '').toLowerCase()
  const ext = name.split('.').pop()
  if (ext === 'csv' || ext === 'txt') {
    return await parseCSVFile(file)
  } else if (ext === 'json') {
    return await parseJSONFile(file)
  } else if (ext === 'xlsx' || ext === 'xls') {
    return await parseXLSXFile(file)
  } else {
    // fallback: try CSV parse
    return await parseCSVFile(file)
  }
}

function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const results = Papa.parse(text, { header: true, skipEmptyLines: true })
        resolve({ rows: results.data, meta: results.meta })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = (err) => reject(err)
    reader.readAsText(file)
  })
}

async function parseJSONFile(file) {
  const text = await file.text()
  try {
    const data = JSON.parse(text)
    // If object has `data` or `rows` key, use it
    if (Array.isArray(data)) return { rows: data, meta: {} }
    if (Array.isArray(data.rows)) return { rows: data.rows, meta: {} }
    if (Array.isArray(data.data)) return { rows: data.data, meta: {} }
    // otherwise, wrap in array
    return { rows: [data], meta: {} }
  } catch (err) {
    throw new Error('Invalid JSON file')
  }
}

async function parseXLSXFile(file) {
  // Dynamically import sheetjs/xlsx to avoid loading on non-xlsx environments
  try {
    const XLSX = await import('xlsx')
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
    return { rows: json, meta: { sheetName } }
  } catch (err) {
    throw new Error('Failed to parse Excel file: ' + err.message)
  }
}

export default { parseFileFromInput }
