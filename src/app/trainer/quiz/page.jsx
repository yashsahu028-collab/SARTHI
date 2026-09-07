"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerQuizPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { quizzes, courses, createQuiz } = useTrainer();

  // Form State for new quiz
  const [newTitle, setNewTitle] = useState("");
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || "satellite-meteorology");
  const [newTimeLimit, setNewTimeLimit] = useState(20);

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    createQuiz({
      title: newTitle,
      courseId: newCourseId,
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Quiz & Question Bank Builder
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Construct timed assessments, manage multiple-choice question banks, and review item difficulty analytics.
          </p>
        </div>

        <button
          type="button"
          className="trainer-quick-btn trainer-btn-green"
          onClick={() => setShowCreateModal(true)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Create New Assessment</span>
        </button>
      </div>

      {/* QUIZ CARDS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="trainer-section-card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <span className="trainer-status-tag tag-graded">PUBLISHED</span>
              <span style={{ fontSize: "12px", color: "var(--tr-text-muted)", fontWeight: "600" }}>⏱️ {quiz.timeLimitMinutes} mins</span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--tr-text-heading)", margin: "0 0 6px 0", lineHeight: 1.35 }}>
              {quiz.title}
            </h3>
            <div style={{ fontSize: "12px", color: "var(--tr-accent-teal)", fontWeight: "700", marginBottom: "16px" }}>
              {quiz.courseTitle}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", background: "var(--tr-surface-alt)", padding: "10px", borderRadius: "8px", marginBottom: "16px", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--tr-text-heading)" }}>{quiz.totalQuestions || quiz.questions?.length || 5}</div>
                <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>Questions</div>
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#0d9488" }}>{quiz.totalAttempts || 42}</div>
                <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>Attempts</div>
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#059669" }}>{quiz.averageScore || 85}%</div>
                <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>Avg Score</div>
              </div>
            </div>

            <div style={{ marginTop: "auto", display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="trainer-quick-btn trainer-btn-outline"
                style={{ flex: 1, justifyContent: "center", height: "34px", fontSize: "12.5px" }}
                onClick={() => setSelectedQuiz(quiz)}
              >
                Inspect Questions ({quiz.questions?.length || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INSPECT QUESTIONS MODAL */}
      {selectedQuiz && (
        <div className="trainer-modal-overlay" onClick={() => setSelectedQuiz(null)}>
          <div className="trainer-modal-card" style={{ maxWidth: "760px" }} onClick={(e) => e.stopPropagation()}>
            <div className="trainer-modal-header">
              <div>
                <h3 className="trainer-modal-title">{selectedQuiz.title}</h3>
                <div style={{ fontSize: "12px", color: "var(--tr-text-muted)", marginTop: "2px" }}>
                  Question Bank & Item Answer Keys &bull; {selectedQuiz.questions?.length || 0} Questions
                </div>
              </div>
              <button className="trainer-modal-close" onClick={() => setSelectedQuiz(null)}>&times;</button>
            </div>

            <div className="trainer-modal-body">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {selectedQuiz.questions?.map((q, idx) => (
                  <div key={q.id || idx} style={{ background: "var(--tr-surface-alt)", border: "1px solid var(--tr-border)", borderRadius: "var(--tr-radius-md)", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "800", fontSize: "13px", color: "var(--tr-primary)" }}>Question {idx + 1}</span>
                      <span style={{ fontSize: "11px", fontWeight: "700", background: q.difficulty === "Hard" ? "#fee2e2" : "#dcfce7", color: q.difficulty === "Hard" ? "#991b1b" : "#166534", padding: "2px 8px", borderRadius: "4px" }}>
                        {q.difficulty || "Medium"}
                      </span>
                    </div>

                    <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--tr-text-heading)", margin: "0 0 12px 0" }}>
                      {q.question}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                      {q.options?.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "12.5px",
                            background: oIdx === q.correctOptionIndex ? "#dcfce7" : "#ffffff",
                            border: oIdx === q.correctOptionIndex ? "1px solid #10b981" : "1px solid var(--tr-border)",
                            color: oIdx === q.correctOptionIndex ? "#166534" : "var(--tr-text-body)",
                            fontWeight: oIdx === q.correctOptionIndex ? "700" : "500",
                          }}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctOptionIndex && "✓ (Correct)"}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div style={{ fontSize: "12px", color: "#475569", background: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px dashed var(--tr-border)" }}>
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
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

      {/* CREATE QUIZ MODAL */}
      {showCreateModal && (
        <div className="trainer-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="trainer-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="trainer-modal-header">
              <h3 className="trainer-modal-title">Create New Quiz Assessment</h3>
              <button className="trainer-modal-close" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateQuiz}>
              <div className="trainer-modal-body">
                <div className="trainer-form-group">
                  <label className="trainer-label">Quiz Title:</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Synoptic Monsoon Intraseasonal Diagnostics"
                    required
                    className="trainer-input"
                  />
                </div>

                <div className="trainer-form-group">
                  <label className="trainer-label">Associated Course:</label>
                  <select value={newCourseId} onChange={(e) => setNewCourseId(e.target.value)} className="trainer-select">
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="trainer-form-group">
                  <label className="trainer-label">Time Limit (Minutes):</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={newTimeLimit}
                    onChange={(e) => setNewTimeLimit(e.target.value)}
                    className="trainer-input"
                  />
                </div>
              </div>
              <div className="trainer-modal-footer">
                <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="trainer-quick-btn trainer-btn-green">Publish Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </TrainerShell>
  );
}
