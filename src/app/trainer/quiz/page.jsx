"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerQuizPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { quizzes, courses, createQuiz } = useTrainer();

  const [newTitle, setNewTitle] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  const [newTimeLimit, setNewTimeLimit] = useState(20);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const targetCourseId = newCourseId || courses[0]?.id;
    await createQuiz({
      title: newTitle,
      courseId: targetCourseId,
      timeLimitMinutes: Number(newTimeLimit),
    });
    setShowCreateModal(false);
    setNewTitle("");
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search quizzes, question concepts...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                ASSESSMENT & QUESTION BANK
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Quiz & Assessment Builder
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Construct timed meteorological assessments, manage multiple-choice question banks, and review item difficulty.
            </p>
          </div>

          <button
            type="button"
            className="db-btn-primary"
            onClick={() => setShowCreateModal(true)}
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
            <span>Create Assessment</span>
          </button>
        </div>

        {/* 3 Top KPI Stat Cards */}
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
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{quizzes.length}</span>
                <span className="db-stat-label">Published Quizzes</span>
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
                <span className="db-stat-value">168</span>
                <span className="db-stat-label">Total Attempts</span>
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
                <span className="db-stat-value">86.2%</span>
                <span className="db-stat-label">Cohort Avg Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span style={{ fontSize: "10.5px", fontWeight: "800", padding: "3px 9px", borderRadius: "999px", background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", textTransform: "uppercase" }}>
                  PUBLISHED
                </span>
                <span style={{ fontSize: "12px", color: "var(--sarthi-text-muted, #64748b)", fontWeight: "600" }}>⏱️ {quiz.timeLimitMinutes} mins</span>
              </div>

              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", lineHeight: 1.35 }}>
                {quiz.title}
              </h3>
              <div style={{ fontSize: "12px", color: "#059669", fontWeight: "700", marginBottom: "16px" }}>
                {quiz.courseTitle}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", background: "var(--sarthi-surface-subtle, #f8faf9)", padding: "10px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", marginBottom: "16px", textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)" }}>{quiz.totalQuestions || quiz.questions?.length || 5}</div>
                  <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>Questions</div>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#059669" }}>{quiz.totalAttempts || 42}</div>
                  <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>Attempts</div>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#059669" }}>{quiz.averageScore || 85}%</div>
                  <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>Avg Score</div>
                </div>
              </div>

              <div style={{ marginTop: "auto" }}>
                <button
                  type="button"
                  className="db-btn-primary"
                  style={{ width: "100%", justifyContent: "center", height: "36px", fontSize: "12.5px", borderRadius: "8px" }}
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  Inspect Questions ({quiz.questions?.length || 0})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Quiz Inspector Modal */}
        {selectedQuiz && (
          <div className="trainer-modal-overlay" onClick={() => setSelectedQuiz(null)}>
            <div className="trainer-modal-card" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
              <div className="trainer-modal-header">
                <div>
                  <h3 className="trainer-modal-title">{selectedQuiz.title}</h3>
                  <div style={{ fontSize: "12px", color: "var(--sarthi-text-muted, #64748b)" }}>
                    {selectedQuiz.courseTitle} &bull; {selectedQuiz.timeLimitMinutes} minutes
                  </div>
                </div>
                <button className="trainer-modal-close" onClick={() => setSelectedQuiz(null)}>&times;</button>
              </div>

              <div className="trainer-modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedQuiz.questions?.map((q, idx) => (
                    <div key={q.id || idx} style={{ background: "var(--sarthi-surface-subtle, #f8faf9)", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "12px", padding: "14px 16px" }}>
                      <div style={{ fontWeight: "700", fontSize: "13.5px", color: "var(--sarthi-text-heading, #0a2920)", marginBottom: "8px" }}>
                        Q{idx + 1}: {q.question}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                        {q.options?.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            style={{
                              fontSize: "12px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              background: oIdx === q.correctAnswer ? "#dcfce7" : "#ffffff",
                              border: oIdx === q.correctAnswer ? "1px solid #86efac" : "1px solid var(--sarthi-border, #e2e8f0)",
                              fontWeight: oIdx === q.correctAnswer ? "700" : "500",
                              color: oIdx === q.correctAnswer ? "#166534" : "inherit",
                            }}
                          >
                            {opt} {oIdx === q.correctAnswer && "✓"}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="trainer-modal-footer">
                <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={() => setSelectedQuiz(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Quiz Modal */}
        {showCreateModal && (
          <div className="trainer-modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="trainer-modal-card" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
              <div className="trainer-modal-header">
                <h3 className="trainer-modal-title">Create New Assessment</h3>
                <button className="trainer-modal-close" onClick={() => setShowCreateModal(false)}>&times;</button>
              </div>

              <form onSubmit={handleCreateQuiz}>
                <div className="trainer-modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: "700" }}>Assessment Title:</label>
                    <input
                      type="text"
                      placeholder="e.g. INSAT-3DR Atmospheric Sounding Quiz"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: "700" }}>Associated Course:</label>
                    <select
                      value={newCourseId}
                      onChange={(e) => setNewCourseId(e.target.value)}
                      style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: "700" }}>Time Limit (Minutes):</label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={newTimeLimit}
                      onChange={(e) => setNewTimeLimit(e.target.value)}
                      style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div className="trainer-modal-footer">
                  <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="db-btn-primary" style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "13px" }}>
                    Publish Assessment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TrainerShell>
  );
}
