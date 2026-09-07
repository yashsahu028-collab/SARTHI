"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const { trainees, setActiveModal } = useTrainer();

  const divisions = ["all", "NWP Modeling", "Satellite Meteorology", "Radar Operations", "Agrometeorological", "Cyclone Warning", "Aviation Weather", "Monsoon Forecasting"];

  const filteredTrainees = useMemo(() => {
    return trainees.filter((t) => {
      const matchDiv = divisionFilter === "all" || t.division.toLowerCase().includes(divisionFilter.toLowerCase());
      const matchTier = tierFilter === "all" || t.performanceTier.toLowerCase() === tierFilter.toLowerCase();
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.division.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiv && matchTier && matchSearch;
    });
  }, [trainees, divisionFilter, tierFilter, searchQuery]);

  const exemplaryCount = trainees.filter((t) => t.performanceTier === "Exemplary").length;
  const onTrackCount = trainees.filter((t) => t.performanceTier === "On Track").length;

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search trainees by name, division, or batch...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                TRAINEE COHORT DIRECTORY
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Trainee Directory & Gradebook
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Monitor academic dossiers, live attendance rates, laboratory grades, and competency tiers across IMD probationary batches.
            </p>
          </div>

          <button
            type="button"
            className="db-btn-primary"
            onClick={() => setActiveModal({ type: "broadcast", data: null })}
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
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Broadcast Notice to All</span>
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
              <div className="db-stat-icon-box purple">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{trainees.length}</span>
                <span className="db-stat-label">Enrolled Trainees</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{exemplaryCount}</span>
                <span className="db-stat-label">Exemplary Tier</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{onTrackCount}</span>
                <span className="db-stat-label">On Track Cohort</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box gold">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">94.8%</span>
                <span className="db-stat-label">Passing Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {["all", "Exemplary", "On Track", "Needs Attention"].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTierFilter(tier)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "700",
                  border: tierFilter === tier ? "1px solid var(--sarthi-primary, #024a3a)" : "1px solid var(--sarthi-border, #e2e8f0)",
                  background: tierFilter === tier ? "var(--sarthi-primary, #024a3a)" : "#ffffff",
                  color: tierFilter === tier ? "#ffffff" : "var(--sarthi-text-body, #334155)",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: tierFilter === tier ? "0 2px 6px rgba(2,74,58,0.2)" : "none",
                }}
              >
                {tier === "all" ? `All Trainees (${trainees.length})` : tier}
              </button>
            ))}
          </div>

          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--sarthi-border, #e2e8f0)",
              fontSize: "13px",
              color: "var(--sarthi-text-heading, #0a2920)",
              background: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
              minWidth: "220px",
            }}
          >
            {divisions.map((d) => (
              <option key={d} value={d}>{d === "all" ? "All IMD Divisions" : d}</option>
            ))}
          </select>
        </div>

        {/* Trainees Table */}
        <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", color: "var(--sarthi-text-muted, #64748b)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Trainee Name</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Division & Cohort</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Live Attendance</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Quiz Avg</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Assignments</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Performance Tier</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainees.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid var(--sarthi-border, #f1f5f9)" }}>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={t.avatar || "/images/student-img-1.jpg"}
                          alt={t.name}
                          style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>{t.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px", color: "var(--sarthi-text-body, #334155)" }}>
                      <div>{t.division}</div>
                      <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>{t.cohort}</div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: "700", color: "#059669" }}>{t.attendance}%</span>
                        <div style={{ width: "60px", height: "5px", background: "#e2e8f0", borderRadius: "999px" }}>
                          <div style={{ width: `${t.attendance}%`, height: "100%", background: "#059669", borderRadius: "999px" }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>
                      {t.quizAverage}%
                    </td>
                    <td style={{ padding: "14px", color: "var(--sarthi-text-muted, #64748b)" }}>
                      {t.assignmentsCompleted} / {t.totalAssignments}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "3px 9px",
                          borderRadius: "999px",
                          background:
                            t.performanceTier === "Exemplary"
                              ? "#dcfce7"
                              : t.performanceTier === "On Track"
                              ? "#eff6ff"
                              : "#fef3c7",
                          color:
                            t.performanceTier === "Exemplary"
                              ? "#166534"
                              : t.performanceTier === "On Track"
                              ? "#1d4ed8"
                              : "#92400e",
                          border:
                            t.performanceTier === "Exemplary"
                              ? "1px solid #bbf7d0"
                              : t.performanceTier === "On Track"
                              ? "1px solid #bfdbfe"
                              : "1px solid #fde68a",
                        }}
                      >
                        {t.performanceTier.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <button
                        type="button"
                        className="db-btn-primary"
                        style={{ padding: "6px 14px", fontSize: "12px", borderRadius: "8px" }}
                        onClick={() => alert(`Dossier for ${t.name}: Attendance ${t.attendance}%, Division: ${t.division}`)}
                      >
                        Dossier
                      </button>
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
