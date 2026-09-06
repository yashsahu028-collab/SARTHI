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

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search trainees by name, division, or batch...">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Trainee Directory & Gradebook
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Monitor academic dossiers, live attendance rates, laboratory grades, and competency tiers across IMD batches.
          </p>
        </div>

        <button
          type="button"
          className="trainer-quick-btn trainer-btn-green"
          onClick={() => setActiveModal({ type: "broadcast", data: null })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Broadcast Notice to All</span>
        </button>
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        {/* Tier Tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "Exemplary", "On Track", "Needs Attention"].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setTierFilter(tier)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                border: tierFilter === tier ? "1px solid var(--tr-primary)" : "1px solid var(--tr-border)",
                background: tierFilter === tier ? "var(--tr-primary)" : "#ffffff",
                color: tierFilter === tier ? "#ffffff" : "var(--tr-text-body)",
                cursor: "pointer",
              }}
            >
              {tier === "all" ? `All Trainees (${trainees.length})` : tier}
            </button>
          ))}
        </div>

        {/* Division Filter */}
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="trainer-select"
          style={{ width: "auto", minWidth: "220px", height: "36px", padding: "0 12px" }}
        >
          {divisions.map((d) => (
            <option key={d} value={d}>{d === "all" ? "All IMD Divisions" : d}</option>
          ))}
        </select>
      </div>

      {/* TRAINEES TABLE */}
      <div className="trainer-section-card">
        <div className="trainer-table-wrap">
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Trainee Details</th>
                <th>Division & Cohort</th>
                <th>Live Attendance</th>
                <th>Quiz Avg</th>
                <th>Assignments</th>
                <th>Performance Tier</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainees.map((trainee) => (
                <tr key={trainee.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={trainee.avatar || "/images/student-img-1.jpg"}
                        alt={trainee.name}
                        style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: "700", color: "var(--tr-text-heading)", fontSize: "14px" }}>
                          {trainee.name}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>
                          {trainee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: "600", color: "var(--tr-text-heading)", fontSize: "13px" }}>
                      {trainee.division}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>
                      {trainee.batch}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: "700", color: trainee.attendanceRate >= 90 ? "#059669" : "#d97706" }}>
                      {trainee.attendanceRate}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: "700", color: trainee.quizAvgScore >= 85 ? "#059669" : "#d97706" }}>
                      {trainee.quizAvgScore}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "12.5px" }}>
                      {trainee.assignmentsSubmitted} done {trainee.assignmentsPending > 0 && `(${trainee.assignmentsPending} pending)`}
                    </span>
                  </td>
                  <td>
                    <span className={`trainer-status-tag ${trainee.performanceTier === "Exemplary" ? "tag-graded" : trainee.performanceTier === "Needs Attention" ? "tag-revision" : "tag-pending"}`}>
                      {trainee.performanceTier}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>
                      {trainee.lastActive}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="trainer-quick-btn trainer-btn-outline"
                        style={{ height: "30px", padding: "0 10px", fontSize: "11.5px" }}
                        onClick={() => setActiveModal({ type: "trainee_dossier", data: trainee })}
                      >
                        Dossier
                      </button>
                      <Link
                        href="/trainer/messages"
                        className="trainer-quick-btn trainer-btn-green"
                        style={{ height: "30px", padding: "0 10px", fontSize: "11.5px", textDecoration: "none" }}
                      >
                        Chat
                      </Link>
                    </div>
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
