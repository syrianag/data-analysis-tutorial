// File: app/analysis/page.js
"use client";

import { QualityScore } from "@/components/analysis/QualityScore";
import { DataVisualizations } from "@/components/analysis/DataVisualizations";
import { AIInsights } from "@/components/analysis/AIInsights";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AnalysisPage() {
  const analysisData = {
    qualityScore: {
      completeness: 98,
      consistency: 80,
      accuracy: 95,
    },
    metrics: {
      completeness: {
        score: 98,
        issues: ["7 missing values across 2 columns"],
      },
      consistency: {
        score: 80,
        issues: ["Format variations in Email field"],
      },
      accuracy: {
        score: 95,
        issues: ["1 outlier detected in Age"],
      },
    },
    visualizations: {
      barChart: {
        data: [
          { metric: "Comp", value: 98 },
          { metric: "Cons", value: 80 },
          { metric: "Acc", value: 95 },
          { metric: "Val", value: 90 },
        ],
      },
      pieChart: {
        data: [
          { type: "Text", count: 4 },
          { type: "Int", count: 2 },
        ],
      },
      columnIssues: [
        { name: "Name", count: 2 },
        { name: "Age", count: 6 },
        { name: "Email", count: 0 },
        { name: "ID", count: 0 },
        { name: "City", count: 0 },
      ],
    },
    recommendations: [
      {
        priority: "High",
        title: "Address Missing Values",
        details: [
          "2 missing values in Name column (3% of data)",
          "5 missing values in Age column (5% of data)",
        ],
        suggestion: "Consider imputation or removal",
      },
      {
        priority: "Medium",
        title: "Standardize Email Format",
        details: ["Some emails use uppercase, others lowercase"],
        suggestion: "SQL: UPDATE table SET email = LOWER(email)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border-4 border-blue-400 shadow-[4px_4px_0px_#93c5fd]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">
              SCREEN 3: Analysis Results (Dashboard)
            </h1>

            {/* Navigation Bar */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 flex items-center justify-between text-sm mb-6 shadow-[3px_3px_0px_#bfdbfe]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-slate-700">
                  [ Logo ]
                </span>
                <span className="text-slate-600">Data Quality Analysis</span>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>

                <span>|</span>

                <Link
                  href="/preview"
                  className="hover:text-blue-600 transition-colors"
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
          <div className="space-y-6">
            {/* Quality Score + Metrics */}
            <div className="grid md:grid-cols-[280px_1fr] gap-6">
              <QualityScore scores={analysisData.metrics} />
              <QualityMetrics metrics={analysisData.metrics} />
            </div>

            {/* Data Visualizations */}
            <DataVisualizations data={analysisData.visualizations} />

            {/* AI-Powered Insights */}
            <AIInsights recommendations={analysisData.recommendations} />
          </div>
        </div>
      </div>
    </div>
  );
}
