"use client";

import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function PreviewPage() {
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    if (analyzing && progress < 75) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 5, 75));
      }, 100);
      return () => clearTimeout(timer);
    }
    if (progress >= 75) {
      setAnalyzing(false);
    }
  }, [progress, analyzing]);

  const previewData = [
    { id: 1, name: 'John Doe', email: 'john@email.com', age: 32, city: 'NYC' },
    { id: 2, name: 'Jane Smith', email: 'jane@email.com', age: 28, city: 'LA' },
    { id: 3, name: 'Bob Jones', email: 'bob@email.com', age: '-', city: 'Boston' },
    { id: 4, name: 'Alice Lee', email: 'alice@email.com', age: 45, city: 'SF' },
    { id: '...', name: '...', email: '...', age: '...', city: '...' }
  ];

  const columnStats = [
    { name: 'ID', type: 'Integer', unique: 100, missing: 0 },
    { name: 'Name', type: 'Text', unique: 98, missing: 2 },
    { name: 'Email', type: 'Text', unique: 100, missing: 0 },
    { name: 'Age', type: 'Integer', unique: 45, missing: 5, outliers: 1 },
    { name: 'City', type: 'Text', unique: 8, missing: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-amber-400">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-amber-500">
              SCREEN 2: Data Preview Page
            </h1>
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <div className="bg-slate-100 rounded-2xl p-4 mb-6 border-2 border-slate-300">
            <div className="flex items-center gap-2 text-slate-700">
              <FileText className="w-5 h-5" />
              <span className="font-medium">File: sales_data.csv (100 rows × 5 columns)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-slate-300">
            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-medium">Analyzing...</span>
              <div className="flex-1 bg-slate-200 rounded-full h-8 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-slate-700 to-slate-900 h-full transition-all duration-300 flex items-center justify-end pr-3"
                  style={{ width: `${progress}%` }}
                >
                  <span className="text-white text-sm font-bold">{progress}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-slate-300">
            <h2 className="font-semibold text-slate-700 mb-4">
              Data Preview (First 100 rows):
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="text-left p-3 font-semibold text-slate-700 border-r border-slate-300">ID</th>
                    <th className="text-left p-3 font-semibold text-slate-700 border-r border-slate-300">Name</th>
                    <th className="text-left p-3 font-semibold text-slate-700 border-r border-slate-300">Email</th>
                    <th className="text-left p-3 font-semibold text-slate-700 border-r border-slate-300">Age</th>
                    <th className="text-left p-3 font-semibold text-slate-700">City</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="p-3 text-slate-600 border-r border-slate-200">{row.id}</td>
                      <td className="p-3 text-slate-600 border-r border-slate-200">{row.name}</td>
                      <td className="p-3 text-slate-600 border-r border-slate-200">{row.email}</td>
                      <td className="p-3 text-slate-600 border-r border-slate-200">{row.age}</td>
                      <td className="p-3 text-slate-600">{row.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3">Column Statistics:</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {columnStats.map((stat, idx) => (
                  <li key={idx}>
                    • <span className="font-semibold">{stat.name}</span>: {stat.type}, {stat.unique} unique, {stat.missing} missing
                    {stat.outliers && `, ${stat.outliers} outlier`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              Initial Quality Overview
              <div className="flex-1 border-t border-slate-400"></div>
            </h3>
            
            <div className="space-y-2 text-sm text-slate-700 mb-6">
              <p>Schema detected: 5 columns identified</p>
              <p>Data types inferred: 2 text, 2 integer, 1 text</p>
              <p>Null values found: 7 total across 2 columns</p>
              <p>Potential issues: 1 outlier detected in 'Age'</p>
            </div>

            <button className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
              [ Continue to Full Analysis → ]
            </button>
          </div>

        </div>
      </div>
    </div>
  );
} 