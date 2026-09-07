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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Grading Desk & Assessment Console
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Review trainee laboratory reports, NetCDF datasets, score rubrics, and publish constructive feedback.
          </p>
        </div>

        <button
          type="button"
          className="trainer-quick-btn trainer-btn-green"
          onClick={() => setActiveModal({ type: "new_assignment", data: null })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* STATS STRIP */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--tr-text-heading)" }}>{assignments.length}</div>
          <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)" }}>Active Assignments</div>
        </div>
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#d97706" }}>{pendingCount}</div>
          <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)" }}>Pending Evaluation</div>
        </div>
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#059669" }}>{gradedCount}</div>
          <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)" }}>Evaluated & Published</div>
        </div>
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--tr-primary)" }}>94.2%</div>
          <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)" }}>Batch Average Score</div>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              border: statusFilter === "all" ? "1px solid var(--tr-primary)" : "1px solid var(--tr-border)",
              background: statusFilter === "all" ? "var(--tr-primary)" : "#ffffff",
              color: statusFilter === "all" ? "#ffffff" : "var(--tr-text-body)",
              cursor: "pointer",
            }}
          >
            All ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              border: statusFilter === "pending" ? "1px solid #d97706" : "1px solid var(--tr-border)",
              background: statusFilter === "pending" ? "#fef3c7" : "#ffffff",
              color: statusFilter === "pending" ? "#92400e" : "var(--tr-text-body)",
              cursor: "pointer",
            }}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("graded")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              border: statusFilter === "graded" ? "1px solid #059669" : "1px solid var(--tr-border)",
              background: statusFilter === "graded" ? "#dcfce7" : "#ffffff",
              color: statusFilter === "graded" ? "#166534" : "var(--tr-text-body)",
              cursor: "pointer",
            }}
          >
            Graded ({gradedCount})
          </button>
        </div>

        {/* Course Dropdown Filter */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="trainer-select"
          style={{ width: "auto", minWidth: "220px", height: "36px", padding: "0 12px" }}
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.title}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* SUBMISSIONS TABLE */}
      <div className="trainer-section-card">
        <div className="trainer-table-wrap">
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Trainee</th>
                <th>Assignment Title</th>
                <th>Course Domain</th>
                <th>Files & Notes</th>
                <th>Submitted</th>
                <th>Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--tr-text-muted)" }}>
                    No submissions matched the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={sub.studentAvatar || "/images/student-img-1.jpg"}
                          alt={sub.studentName}
                          style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: "700", color: "var(--tr-text-heading)" }}>{sub.studentName}</div>
                          <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>{sub.division}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", color: "var(--tr-text-heading)" }}>{sub.assignmentTitle}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: "var(--tr-text-muted)" }}>{sub.courseTitle}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: "11.5px", background: "var(--tr-surface-alt)", padding: "3px 8px", borderRadius: "4px", border: "1px solid var(--tr-border)" }}>
                        📎 {sub.files?.length || 1} file(s)
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: "var(--tr-text-muted)" }}>
                        {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td>
                      {sub.score !== null ? (
                        <span style={{ fontWeight: "800", color: "#059669", fontSize: "13.5px" }}>
                          {sub.score} / {sub.maxScore}
                        </span>
                      ) : (
                        <span style={{ color: "var(--tr-text-light)", fontSize: "12px" }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`trainer-status-tag ${sub.status === "graded" ? "tag-graded" : "tag-pending"}`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`trainer-quick-btn ${sub.status === "pending" ? "trainer-btn-green" : "trainer-btn-outline"}`}
                        style={{ height: "30px", padding: "0 12px", fontSize: "11.5px" }}
                        onClick={() => setActiveModal({ type: "grading", data: sub })}
                      >
                        {sub.status === "pending" ? "Grade Now" : "Review Score"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TrainerShell>
  );
}
