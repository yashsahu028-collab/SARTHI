"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { EmptyState } from "@/components/dashboard/StateViews";

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
    case "medal":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
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

export default function ProgressPage() {
  const { student, assignments, certificates, courses } = useStudent();
  const [searchQuery, setSearchQuery] = useState("");

  const competencies = useMemo(
    () => [
      { name: "Satellite Meteorology & Remote Sensing", pct: 90, iconType: "satellite", level: "Expert", xp: "280 XP" },
      { name: "Doppler Weather Radar (DWR) Dynamics", pct: 78, iconType: "radar", level: "Proficient", xp: "210 XP" },
      { name: "NWP Numerical Modeling & Data Assimilation", pct: 95, iconType: "nwp", level: "Master", xp: "320 XP" },
      { name: "Synoptic Monsoon Dynamics & Forecasting", pct: 80, iconType: "monsoon", level: "Proficient", xp: "190 XP" },
      { name: "Agrometeorology & Disaster Early Warning", pct: 85, iconType: "disaster", level: "Advanced", xp: "240 XP" },
    ],
    []
  );

  const weeklyHours = [
    { day: "Mon", hours: 2.5, max: 4 },
    { day: "Tue", hours: 3.2, max: 4 },
    { day: "Wed", hours: 1.8, max: 4 },
    { day: "Thu", hours: 3.8, max: 4 },
    { day: "Fri", hours: 2.2, max: 4 },
    { day: "Sat", hours: 1.0, max: 4 },
    { day: "Sun", hours: 0.5, max: 4 },
  ];

  const badges = [
    {
      id: "b-1",
      title: "IMD Meteorologist Trainee",
      iconType: "medal",
      tier: "Official Credential",
      date: "Awarded Jan 2026",
      color: "var(--sarthi-primary)",
    },
    {
      id: "b-2",
      title: "Satellite Radiance Analyst",
      iconType: "satellite",
      tier: "Gold Honors",
      date: "Awarded Feb 2026",
      color: "#059669",
    },
    {
      id: "b-3",
      title: "NWP Boundary Layer Master",
      iconType: "nwp",
      tier: "Platinum Distinction",
      date: "Awarded Feb 2026",
      color: "#047857",
    },
    {
      id: "b-4",
      title: "Radar Storm Tracker",
      iconType: "radar",
      tier: "Operational Badge",
      date: "Awarded Dec 2025",
      color: "#d97706",
    },
  ];

  const filteredCompetencies = competencies.filter(
    (c) =>
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gradedCount = assignments.filter((a) => a.status === "graded").length;

  return (
    <StudentShell
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search competencies, metrics, or badges..."
    >
      <div style={{ padding: "28px 36px 64px", maxWidth: "1360px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Apple-style Page Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              COMPETENCY & LEARNING ANALYTICS
            </span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0", letterSpacing: "-0.6px" }}>
            Trainee Progress
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, fontWeight: "400" }}>
            Track your curriculum completion, domain competencies, weekly distribution, and official credentials.
          </p>
        </div>

        {/* 4 Clean Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{student.overallProgress || 92}%</span>
                <span className="db-stat-label">Overall Completion</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box purple">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{student.hoursLearned || 42} hrs</span>
                <span className="db-stat-label">Time Invested</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{gradedCount} / {assignments.length}</span>
                <span className="db-stat-label">Tasks Graded</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box gold">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{certificates.length || student.certificatesCount || 3}</span>
                <span className="db-stat-label">Certificates Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Clean Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(360px, 1fr)", gap: "28px", alignItems: "start" }}>
          {/* Left Column: Domain Competencies */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              padding: "24px 28px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: 0 }}>
                  IMD Competency Breakdown
                </h3>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "3px 0 0 0" }}>
                  Assessed from practical laboratory benchmarks and simulation evaluations.
                </p>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "var(--sarthi-primary)",
                  background: "var(--sarthi-mint-100)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                }}
              >
                Top 5% Cadet
              </span>
            </div>

            {filteredCompetencies.length === 0 ? (
              <EmptyState
                title="No competencies found"
                description={`No competencies matched "${searchQuery}". Try searching for "Radar" or "Monsoon".`}
                actionLabel="Clear Filter"
                onAction={() => setSearchQuery("")}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {filteredCompetencies.map((comp, idx) => (
                  <div key={idx} style={{ padding: "4px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "#f0fdf4",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            color: "var(--sarthi-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <ProgressIcon type={comp.iconType} />
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                            {comp.name}
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Level: {comp.level} • {comp.xp}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--sarthi-primary)" }}>
                        {comp.pct}%
                      </span>
                    </div>

                    <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${comp.pct}%`,
                          background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                          borderRadius: "999px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Weekly Study & Badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Weekly Study Distribution Chart */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 }}>
                    Weekly Study Hours
                  </h3>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Current Week (14.5 hrs total)</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-primary)", background: "var(--sarthi-mint-100)", padding: "3px 8px", borderRadius: "6px" }}>
                  +18% vs last week
                </span>
              </div>

              {/* Minimal Bar Chart */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "130px", paddingTop: "12px", gap: "8px" }}>
                {weeklyHours.map((w, i) => {
                  const barHeightPct = (w.hours / w.max) * 100;
                  const isMax = w.hours >= 3.5;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
                      <span style={{ fontSize: "10px", fontWeight: "600", color: "#9ca3af" }}>{w.hours}h</span>
                      <div style={{ width: "100%", maxWidth: "24px", height: "80px", background: "#f3f4f6", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                        <div
                          style={{
                            width: "100%",
                            height: `${barHeightPct}%`,
                            background: isMax ? "linear-gradient(180deg, #10b981 0%, #059669 100%)" : "linear-gradient(180deg, #6ee7b7 0%, #10b981 100%)",
                            borderRadius: "6px",
                            transition: "height 0.4s ease",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "#374151" }}>{w.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges Wallet */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 }}>
                  Earned Milestone Badges
                </h3>
                <Link
                  href="/dashboard/certificates"
                  style={{ fontSize: "12px", fontWeight: "600", color: "var(--sarthi-primary)", textDecoration: "none" }}
                >
                  View Wallet →
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {badges.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid rgba(0, 0, 0, 0.04)",
                      borderRadius: "12px",
                      padding: "14px 10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.06)",
                        color: b.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
                      }}
                    >
                      <ProgressIcon type={b.iconType} />
                    </div>
                    <h5 style={{ fontSize: "12px", fontWeight: "700", color: "#111827", margin: "0 0 3px 0" }}>
                      {b.title}
                    </h5>
                    <span style={{ fontSize: "10px", fontWeight: "600", color: b.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {b.tier}
                    </span>
                    <span style={{ fontSize: "9.5px", color: "#9ca3af", marginTop: "4px" }}>
                      {b.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
