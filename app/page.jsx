"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Home,
  FileBarChart,
  FileSearch,
} from "lucide-react";
import Link from "next/link";

export default function DataQualityHomepage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const recentAnalyses = [
    { name: "sales_data.csv", score: 95, quality: "Good", time: "2 hours ago" },
    { name: "users.json", score: 72, quality: "Good", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Container */}
        <div className="bg-white rounded-2xl p-8 border-4 border-emerald-400 shadow-[4px_4px_0px_#80d4b8]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-600 mb-4">
              Home
            </h1>

            {/* Navigation Bar */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between text-sm mb-6 shadow-[3px_3px_0px_#b7f7d8]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-slate-700">
                  [ Logo ]
                </span>
                <span className="text-slate-600">Data Quality Analysis</span>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <span>|</span>
                <Link
                  href="/preview"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Preview Demo
                </Link>
                <span>|</span>
                <span>About</span>
                <span>|</span>
                <span>Docs</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-emerald-300 shadow-[3px_3px_0px_#b7f7d8]">
            <h2 className="text-xl font-semibold text-center text-slate-700 mb-2">
              Upload Your Dataset
            </h2>
            <p className="text-center text-emerald-600 font-medium mb-6">
              Instant AI-Powered Quality Analysis
            </p>

            {/* Drag & Drop Zone */}
            <div
              className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all shadow-[3px_3px_0px_#b8f5d5] ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-emerald-400 bg-emerald-50/40"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
              <p className="text-emerald-600 font-semibold text-lg mb-2">
                Drag & Drop File Here
              </p>
              <p className="text-slate-500 mb-4">or</p>

              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".csv,.json,.xlsx,.xls"
                />
                <span className="px-6 py-3 bg-emerald-500 text-white rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors inline-block font-medium shadow-[2px_2px_0px_#9ae6c3]">
                  [ Choose File ]
                </span>
              </label>

              {selectedFile && (
                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-[2px_2px_0px_#c8f7e1]">
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400 mt-6">
                Supported: CSV, JSON, Excel (.xlsx, .xls)
              </p>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-[3px_3px_0px_#f7d9a0]">
            <h3 className="font-semibold text-slate-700 mb-4">
              Recent Analyses:
            </h3>

            {recentAnalyses.map((analysis, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                <FileBarChart className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-slate-700">
                    <span className="font-semibold">{analysis.name}</span> - Score:{" "}
                    {analysis.score} ({analysis.quality})
                  </p>
                  <p className="text-slate-500 text-xs">Analyzed: {analysis.time}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-amber-300">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Quick Tips:
              </p>
              <p className="text-xs text-slate-600">
                • Ensure column headers are in first row
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
