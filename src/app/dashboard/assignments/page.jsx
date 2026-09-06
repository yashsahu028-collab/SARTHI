"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { EmptyState } from "@/components/dashboard/StateViews";

export default function AssignmentsPage() {
  const { assignments } = useStudent();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (activeTab === "pending" && a.status !== "pending") return false;
      if (activeTab === "submitted" && a.status !== "submitted") return false;
      if (activeTab === "graded" && a.status !== "graded") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return a.title?.toLowerCase().includes(q) || a.course?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [assignments, activeTab, searchQuery]);

  const stats = {
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
    overdue: assignments.filter((a) => a.status === "overdue").length,
  };

  return (
    <StudentShell
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search assignments, tasks, or course codes..."
    >
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Hierarchy) */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              ACADEMIC TASKS
            </span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Assignments
          </h1>
          <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted)", margin: 0, maxWidth: "600px" }}>
            Review, complete, and submit your meteorological laboratory practicals and modeling assignments.
          </p>
        </div>

        {/* 3 Summary Counters (Pending, Submitted, Graded) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value" style={{ color: "#d97706" }}>{stats.pending}</span>
                <span className="db-stat-label">Pending</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value" style={{ color: "#2563eb" }}>{stats.submitted}</span>
                <span className="db-stat-label">Submitted</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value" style={{ color: "#059669" }}>{stats.graded}</span>
                <span className="db-stat-label">Graded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segmented Status Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--sarthi-border)",
            paddingBottom: "14px",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "4px",
              background: "#ffffff",
              padding: "4px",
              borderRadius: "var(--sarthi-radius-pill)",
              border: "1px solid var(--sarthi-border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            {[
              { id: "all", label: "All Tasks" },
              { id: "pending", label: `Pending (${stats.pending})` },
              { id: "submitted", label: `Submitted (${stats.submitted})` },
              { id: "graded", label: `Graded (${stats.graded})` },
            ].map((tab) => {
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "var(--sarthi-radius-pill)",
                    border: "none",
                    background: isCurrent ? "var(--sarthi-pine-deep)" : "transparent",
                    color: isCurrent ? "#ffffff" : "var(--sarthi-text-muted)",
                    fontWeight: isCurrent ? "700" : "600",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: "12.5px", color: "var(--sarthi-text-muted)" }}>
            Showing {filteredAssignments.length} assignments
          </span>
        </div>

        {/* Assignment Cards List */}
        {filteredAssignments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredAssignments.map((asn) => {
              const isPending = asn.status === "pending";
              const isSubmitted = asn.status === "submitted";
              const isGraded = asn.status === "graded";

              let statusBg = "#fef3c7";
              let statusColor = "#b45309";
              let statusLabel = "Pending";

              if (isSubmitted) {
                statusBg = "#eff6ff";
                statusColor = "#1d4ed8";
                statusLabel = "Submitted";
              } else if (isGraded) {
                statusBg = "#ecfdf5";
                statusColor = "#047857";
                statusLabel = `Graded • ${asn.grade || "95/100"}`;
              }

              return (
                <div
                  key={asn.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--sarthi-border)",
                    borderRadius: "16px",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ flex: "1 1 360px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#065f46" }}>
                        {asn.course}
                      </span>
                      <span
                        style={{
                          background: statusBg,
                          color: statusColor,
                          fontSize: "10.5px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--sarthi-text-heading)", margin: 0 }}>
                      {asn.title}
                    </h3>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "4px", fontSize: "12px", color: "var(--sarthi-text-muted)" }}>
                      <span>Due: {asn.dueDate || "March 15, 2026"}</span>
                      <span>•</span>
                      <span>Worth {asn.points || 100} XP</span>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/dashboard/assignments/${asn.id}`}
                      style={{
                        background: isPending ? "var(--sarthi-pine-deep)" : "#f8fafc",
                        color: isPending ? "#ffffff" : "#334155",
                        border: isPending ? "none" : "1px solid #e2e8f0",
                        padding: "9px 20px",
                        borderRadius: "var(--sarthi-radius-pill)",
                        fontSize: "13px",
                        fontWeight: "600",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.18s ease",
                        boxShadow: isPending ? "0 2px 8px rgba(10, 56, 45, 0.18)" : "none",
                      }}
                    >
                      {isPending ? "Submit Assignment →" : isSubmitted ? "View Submission" : "View Feedback"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Assignments Waiting For You"
            description="You are completely caught up! New operational assignments will appear here when published by your mentors."
            actionLabel="View Enrolled Courses"
            actionHref="/dashboard/courses"
          />
        )}
      </div>
    </StudentShell>
  );
}
