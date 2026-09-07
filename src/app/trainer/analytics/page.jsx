"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

function ProgressIcon({ type }) {
  const iconProps = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (type) {
    case "satellite":
      return (
        <svg {...iconProps}>
          <path d="M13 7 9 3 5 7l4 4" />
          <path d="m17 11 4 4-4 4-4-4" />
          <path d="m8 12 4 4" />
          <path d="m16 8 4-4" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "radar":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 6a6 6 0 0 1 6 6" />
          <circle cx="12" cy="12" r="2" />
          <line x1="12" y1="12" x2="19" y2="5" />
        </svg>
      );
    case "nwp":
      return (
        <svg {...iconProps}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "monsoon":
      return (
        <svg {...iconProps}>
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M16 14v6" />
          <path d="M8 14v6" />
          <path d="M12 16v6" />
        </svg>
      );
    case "disaster":
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
  }
}

export default function TrainerAnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);
  const { trainer, courses, trainees } = useTrainer();

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("IMD Capacity Building Training Report (PDF) generated successfully!");
    }, 1000);
  };

  const competencies = [
    { name: "INSAT-3DR Satellite Radiometry & RGB Cloud Masking", score: 92, target: 85, iconType: "satellite" },
    { name: "Doppler Velocity De-aliasing & Radar Mesocyclone Detection", score: 84, target: 80, iconType: "radar" },
    { name: "NWP Atmospheric Primitive Equations & WRF-DA Tuning", score: 88, target: 80, iconType: "nwp" },
    { name: "Monsoon Synoptic Teleconnections & Intraseasonal MJO", score: 79, target: 75, iconType: "monsoon" },
    { name: "Tropical Cyclone Dvorak Technique & Early Warning", score: 96, target: 90, iconType: "disaster" },
  ];

  const divisionStats = [
    { name: "Numerical Weather Prediction (NWP)", trainees: 42, avgScore: 94.2, attendance: "96%", status: "Exemplary" },
    { name: "Satellite Meteorology Division", trainees: 38, avgScore: 95.8, attendance: "98%", status: "Exemplary" },
    { name: "Radar Operations (DWR Network)", trainees: 32, avgScore: 86.4, attendance: "89%", status: "On Track" },
    { name: "Cyclone Warning Division (CWD HQ)", trainees: 26, avgScore: 97.1, attendance: "99%", status: "Exemplary" },
    { name: "Agrometeorological Advisory Div.", trainees: 24, avgScore: 88.0, attendance: "91%", status: "On Track" },
    { name: "Aviation Weather (IGI Airport)", trainees: 24, avgScore: 82.5, attendance: "86%", status: "On Track" },
  ];

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search competencies, divisions...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                COHORT COMPETENCY & ANALYTICS
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Division Training Analytics & Mastery
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Macro and micro competency benchmarks across IMD meteorological probationary divisions and operational cadres.
            </p>
          </div>

          <button
            type="button"
            className="db-btn-primary"
            onClick={handleExport}
            disabled={exporting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "13.5px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{exporting ? "Generating Report..." : "Export Division Report (PDF)"}</span>
          </button>
        </div>

        {/* 4 Top KPI Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{trainer.averagePassRate || 94}%</span>
                <span className="db-stat-label">Cohort Pass Rate</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box purple">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">92.4%</span>
                <span className="db-stat-label">Live Attendance Avg</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{trainer.totalTrainingHours || 48}h</span>
                <span className="db-stat-label">Faculty Hours</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box gold">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">18</span>
                <span className="db-stat-label">Endorsement Eligible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Centerpiece Competency Card with Donut Chart Gauge */}
        <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: 0 }}>
              National IMD Syllabus Competency Matrix
            </h3>
            <span style={{ fontSize: "12px", color: "var(--sarthi-text-muted, #64748b)" }}>
              Evaluated across 5 Core Disciplines
            </span>
          </div>

          <div className="db-progress-main-row">
            {/* Left: Circular Donut Gauge */}
            <div className="db-donut-chart-container">
              <svg className="db-donut-svg" viewBox="0 0 140 140">
                <circle className="db-donut-track" cx="70" cy="70" r="54" />
                <circle
                  className="db-donut-fill"
                  cx="70"
                  cy="70"
                  r="54"
                  strokeDasharray={339.29}
                  strokeDashoffset={339.29 - (339.29 * 94) / 100}
                />
              </svg>
              <div className="db-donut-center-text">
                <span className="db-donut-percent">94%</span>
                <span className="db-donut-label">Batch Avg</span>
              </div>
            </div>

            {/* Right: Competency Rows */}
            <div className="db-competency-list">
              {competencies.map((comp, idx) => (
                <div key={idx} className="db-competency-row">
                  <div className="db-comp-header">
                    <div className="db-comp-left">
                      <div className="db-comp-icon-box">
                        <ProgressIcon type={comp.iconType} />
                      </div>
                      <span className="db-comp-name" title={comp.name}>{comp.name}</span>
                    </div>
                    <span className="db-comp-pct">{comp.score}%</span>
                  </div>
                  <div className="db-comp-bar-track">
                    <div className="db-comp-bar-fill" style={{ width: `${comp.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Division Breakdown Table */}
        <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: 0 }}>
              Division Performance Breakdown
            </h3>
            <span style={{ fontSize: "12px", color: "var(--sarthi-text-muted, #64748b)" }}>
              6 IMD Divisions Tracked
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", color: "var(--sarthi-text-muted, #64748b)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Division Directorate</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Enrolled Trainees</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Average Score</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Live Attendance</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Performance Tier</th>
                </tr>
              </thead>
              <tbody>
                {divisionStats.map((div, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--sarthi-border, #f1f5f9)" }}>
                    <td style={{ padding: "14px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>
                      {div.name}
                    </td>
                    <td style={{ padding: "14px", color: "var(--sarthi-text-body, #334155)" }}>
                      {div.trainees} Trainees
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ fontWeight: "700", color: "#059669" }}>{div.avgScore}%</span>
                    </td>
                    <td style={{ padding: "14px", color: "var(--sarthi-text-body, #334155)" }}>
                      {div.attendance}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "3px 9px",
                          borderRadius: "999px",
                          background: div.status === "Exemplary" ? "#dcfce7" : "#eff6ff",
                          color: div.status === "Exemplary" ? "#166534" : "#1d4ed8",
                          border: div.status === "Exemplary" ? "1px solid #bbf7d0" : "1px solid #bfdbfe",
                        }}
                      >
                        {div.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TrainerShell>
  );
}
