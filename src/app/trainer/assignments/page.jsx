"use client";

import React, { useState, useMemo } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerAssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'graded'
  const [courseFilter, setCourseFilter] = useState("all");
  const { assignments, submissions, courses, setActiveModal } = useTrainer();

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchStatus = statusFilter === "all" || sub.status === statusFilter;
      const matchCourse = courseFilter === "all" || sub.courseTitle?.toLowerCase().includes(courseFilter.toLowerCase()) || sub.assignmentId?.includes(courseFilter);
      const matchSearch =
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.division.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCourse && matchSearch;
    });
  }, [submissions, statusFilter, courseFilter, searchQuery]);

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search trainee submissions or assignments...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                ACADEMIC EVALUATION DESK
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Grading Desk & Submissions
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Review trainee laboratory practicals, NetCDF data analysis reports, evaluate rubrics, and publish feedback.
            </p>
          </div>

          <button
            type="button"
            className="db-btn-primary"
            onClick={() => setActiveModal({ type: "new_assignment", data: null })}
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Create Assignment</span>
          </button>
        </div>

        {/* 4 KPI Stat Cards */}
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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{assignments.length}</span>
                <span className="db-stat-label">Active Practicals</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value" style={{ color: "#d97706" }}>{pendingCount}</span>
                <span className="db-stat-label">Pending Evaluation</span>
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
                <span className="db-stat-value">{gradedCount}</span>
                <span className="db-stat-label">Evaluated & Passed</span>
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
                <span className="db-stat-value">94.2%</span>
                <span className="db-stat-label">Batch Avg Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "all", label: `All (${submissions.length})` },
              { id: "pending", label: `Pending Review (${pendingCount})` },
              { id: "graded", label: `Graded (${gradedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "700",
                  border: statusFilter === tab.id ? "1px solid var(--sarthi-primary, #024a3a)" : "1px solid var(--sarthi-border, #e2e8f0)",
                  background: statusFilter === tab.id ? "var(--sarthi-primary, #024a3a)" : "#ffffff",
                  color: statusFilter === tab.id ? "#ffffff" : "var(--sarthi-text-body, #334155)",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: statusFilter === tab.id ? "0 2px 6px rgba(2,74,58,0.2)" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--sarthi-border, #e2e8f0)",
              fontSize: "13px",
              color: "var(--sarthi-text-heading, #0a2920)",
              background: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            <option value="all">All Specialization Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.title}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Submissions Table in White Rounded Card */}
        <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", color: "var(--sarthi-text-muted, #64748b)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Trainee Name</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Assignment Practical</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Division</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Submission Date</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "36px 14px", textAlign: "center", color: "var(--sarthi-text-muted, #64748b)" }}>
                      No submissions match your active filter.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid var(--sarthi-border, #f1f5f9)" }}>
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={sub.avatar || "/images/student-img-1.jpg"}
                            alt={sub.studentName}
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>
                              {sub.studentName}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>
                              {sub.rollNo || "IMD-TR-2025-04"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px" }}>
                        <div style={{ fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>
                          {sub.assignmentTitle}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--sarthi-text-muted, #64748b)" }}>
                          {sub.courseTitle}
                        </div>
                      </td>
                      <td style={{ padding: "14px", color: "var(--sarthi-text-body, #334155)" }}>
                        <span style={{ fontSize: "12px", background: "var(--sarthi-surface-subtle, #f8faf9)", padding: "3px 8px", borderRadius: "6px", border: "1px solid var(--sarthi-border, #e2e8f0)" }}>
                          {sub.division}
                        </span>
                      </td>
                      <td style={{ padding: "14px", color: "var(--sarthi-text-muted, #64748b)" }}>
                        {sub.submittedAt}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            padding: "3px 9px",
                            borderRadius: "999px",
                            background: sub.status === "graded" ? "#dcfce7" : "#fef3c7",
                            color: sub.status === "graded" ? "#166534" : "#92400e",
                            border: sub.status === "graded" ? "1px solid #bbf7d0" : "1px solid #fde68a",
                          }}
                        >
                          {sub.status === "graded" ? `GRADED (${sub.grade}/100)` : "PENDING REVIEW"}
                        </span>
                      </td>
                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <button
                          type="button"
                          className="db-btn-primary"
                          style={{ padding: "6px 14px", fontSize: "12px", borderRadius: "8px" }}
                          onClick={() => setActiveModal({ type: "grade_submission", data: sub })}
                        >
                          {sub.status === "graded" ? "View Rubric" : "Grade Now"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TrainerShell>
  );
}
