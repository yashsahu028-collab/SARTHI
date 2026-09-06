"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerAnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);
  const { trainer, courses, trainees } = useTrainer();

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("IMD Capacity Building Training Report (PDF/Excel) generated successfully!");
    }, 1200);
  };

  const competencies = [
    { name: "INSAT-3DR Satellite Radiometry & RGB Cloud Masking", score: 92, target: 85, color: "#10b981" },
    { name: "Doppler Velocity De-aliasing & Radar Mesocyclone Detection", score: 84, target: 80, color: "#0d9488" },
    { name: "NWP Atmospheric Primitive Equations & WRF-DA Tuning", score: 88, target: 80, color: "#4f46e5" },
    { name: "Monsoon Synoptic Teleconnections & Intraseasonal MJO", score: 79, target: 75, color: "#f59e0b" },
    { name: "Tropical Cyclone Dvorak Technique & Early Warning", score: 96, target: 90, color: "#059669" },
  ];

  const divisionStats = [
    { name: "Numerical Weather Prediction (NWP)", trainees: 42, avgScore: 94.2, attendance: "96%", status: "Exemplary" },
    { name: "Satellite Meteorology Division", trainees: 38, avgScore: 95.8, attendance: "98%", status: "Exemplary" },
    { name: "Radar Operations (DWR Network)", trainees: 32, avgScore: 86.4, attendance: "89%", status: "On Track" },
    { name: "Cyclone Warning Division (CWD HQ)", trainees: 26, avgScore: 97.1, attendance: "99%", status: "Exemplary" },
    { name: "Agrometeorological Advisory Div.", trainees: 24, avgScore: 88.0, attendance: "91%", status: "On Track" },
    { name: "Aviation Weather (IGI Airport)", trainees: 24, avgScore: 78.5, attendance: "82%", status: "Needs Attention" },
  ];

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search competencies, divisions...">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Division Training Analytics & Cohort Mastery
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Macro & micro competency benchmarks across IMD meteorological probationary divisions.
          </p>
        </div>

        <button
          type="button"
          className="trainer-quick-btn trainer-btn-green"
          onClick={handleExport}
          disabled={exporting}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>{exporting ? "Generating Report..." : "Export Division Report (PDF)"}</span>
        </button>
      </div>

      {/* TOP KPI ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#059669" }}>{trainer.averagePassRate}%</div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)", marginTop: "4px" }}>Cohort Pass Rate</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>+3.2% above national benchmark</div>
        </div>

        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#0d9488" }}>92.4%</div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)", marginTop: "4px" }}>Live Attendance Avg</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>Across 24 live masterclass sessions</div>
        </div>

        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#4f46e5" }}>{trainer.totalTrainingHours}h</div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)", marginTop: "4px" }}>Faculty Training Hours</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>Delivered this academic calendar</div>
        </div>

        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#d97706" }}>84.5%</div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)", marginTop: "4px" }}>Assignment Completion</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>14 submissions pending grading</div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: COMPETENCIES & DIVISION BREAKDOWN */}
      <div className="trainer-grid-layout" style={{ marginBottom: "32px" }}>
        {/* COMPETENCIES BARS */}
        <div className="trainer-section-card">
          <h2 className="trainer-section-title" style={{ marginBottom: "16px" }}>
            <span>🎯</span> Scientific Competency Benchmarks
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {competencies.map((c, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)" }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: c.color }}>
                    {c.score}% (Target: {c.target}%)
                  </span>
                </div>
                <div className="trainer-progress-bar-wrap" style={{ height: "8px", marginBottom: 0 }}>
                  <div style={{ height: "100%", background: c.color, width: `${c.score}%`, borderRadius: "999px" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BATCH HEALTH TIERS */}
        <div className="trainer-section-card">
          <h2 className="trainer-section-title" style={{ marginBottom: "16px" }}>
            <span>📈</span> Trainee Tier Distribution
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "14px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#065f46" }}>
                <span>Exemplary (90%+)</span>
                <span>89 Trainees</span>
              </div>
              <div style={{ fontSize: "12px", color: "#047857", marginTop: "4px" }}>
                Eligible for Advanced Operational Cyclone & Radar Posting
              </div>
            </div>

            <div style={{ padding: "14px", background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#115e59" }}>
                <span>On Track (75% - 89%)</span>
                <span>78 Trainees</span>
              </div>
              <div style={{ fontSize: "12px", color: "#0f766e", marginTop: "4px" }}>
                Normal progression through remaining laboratory modules
              </div>
            </div>

            <div style={{ padding: "14px", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#92400e" }}>
                <span>Needs Attention (&lt;75%)</span>
                <span>19 Trainees</span>
              </div>
              <div style={{ fontSize: "12px", color: "#b45309", marginTop: "4px" }}>
                Recommended for dedicated 1-on-1 faculty clinic
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIVISION BREAKDOWN TABLE */}
      <div className="trainer-section-card">
        <h2 className="trainer-section-title" style={{ marginBottom: "16px" }}>
          <span>🏛️</span> Performance by IMD Division
        </h2>

        <div className="trainer-table-wrap">
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Division Name</th>
                <th>Enrolled Officers</th>
                <th>Average Score</th>
                <th>Live Attendance</th>
                <th>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {divisionStats.map((div, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: "700", color: "var(--tr-text-heading)" }}>{div.name}</td>
                  <td>{div.trainees} Officers</td>
                  <td style={{ fontWeight: "700", color: div.avgScore >= 90 ? "#059669" : "#d97706" }}>
                    {div.avgScore}%
                  </td>
                  <td>{div.attendance}</td>
                  <td>
                    <span className={`trainer-status-tag ${div.status === "Exemplary" ? "tag-graded" : div.status === "Needs Attention" ? "tag-revision" : "tag-pending"}`}>
                      {div.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TrainerShell>
  );
}
