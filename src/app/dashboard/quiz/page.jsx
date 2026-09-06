"use client";

import React, { useState } from "react";
import Link from "next/link";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { EmptyState } from "@/components/dashboard/StateViews";

export default function QuizDashboardPage() {
  const { quizzes } = useStudent();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeQuizzes = quizzes.filter((q) => q.status === "active");
  const completedQuizzes = quizzes.filter((q) => q.status === "completed");

  const averageScore = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((acc, q) => acc + (q.bestScore || 0), 0) / completedQuizzes.length)
    : 88;

  const filteredQuizzes = quizzes.filter((q) => {
    if (activeTab === "active" && q.status !== "active") return false;
    if (activeTab === "completed" && q.status !== "completed") return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return q.title?.toLowerCase().includes(query) || q.course?.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <StudentShell
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search quizzes, assessments, or topics..."
    >
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Hierarchy) */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              ASSESSMENT CENTER
            </span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Quizzes & Diagnostics
          </h1>
          <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted)", margin: 0, maxWidth: "600px" }}>
            Test your scientific comprehension across satellite telemetry, numerical prediction modeling, and Doppler storm tracking.
          </p>
        </div>

        {/* 3 Summary Counters */}
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
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{activeQuizzes.length}</span>
                <span className="db-stat-label">Available Quizzes</span>
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
                <span className="db-stat-value">{completedQuizzes.length}</span>
                <span className="db-stat-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
                <span style={{ fontSize: "14px", fontWeight: "800" }}>%</span>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{averageScore}%</span>
                <span className="db-stat-label">Average Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segmented Filter Control */}
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
              { id: "all", label: "All Assessments" },
              { id: "active", label: `Available (${activeQuizzes.length})` },
              { id: "completed", label: `Completed (${completedQuizzes.length})` },
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
            Showing {filteredQuizzes.length} assessments
          </span>
        </div>

        {/* Quizzes List */}
        {filteredQuizzes.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredQuizzes.map((quiz) => {
              const isCompleted = quiz.status === "completed";
              const questionsCount = quiz.questions?.length || 5;

              return (
                <div
                  key={quiz.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--sarthi-border)",
                    borderRadius: "18px",
                    padding: "20px 26px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ flex: "1 1 380px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#065f46" }}>
                        {quiz.course || "IMD Meteorological Division"}
                      </span>
                      {isCompleted ? (
                        <span style={{ background: "#ecfdf5", color: "#047857", fontSize: "10.5px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                          Score: {quiz.bestScore || 90}%
                        </span>
                      ) : (
                        <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: "10.5px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}>
                          Pass: {quiz.passingScore || 70}%
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: "16.5px", fontWeight: "700", color: "var(--sarthi-text-heading)", margin: "0 0 6px 0" }}>
                      {quiz.title}
                    </h3>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--sarthi-text-muted)" }}>
                      <span>{questionsCount} Questions</span>
                      <span>•</span>
                      <span>{quiz.durationMinutes || 15} Minutes</span>
                      <span>•</span>
                      <span>Attempts: {quiz.attempts || 0}</span>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/dashboard/quiz/${quiz.id}/assessment`}
                      style={{
                        background: isCompleted ? "#f8fafc" : "var(--sarthi-pine-deep)",
                        color: isCompleted ? "#334155" : "#ffffff",
                        border: isCompleted ? "1px solid #e2e8f0" : "none",
                        padding: "9px 22px",
                        borderRadius: "var(--sarthi-radius-pill)",
                        fontSize: "13px",
                        fontWeight: "600",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: isCompleted ? "none" : "0 2px 8px rgba(10, 56, 45, 0.18)",
                        transition: "all 0.18s ease",
                      }}
                    >
                      {isCompleted ? "Retake Quiz" : "Start Quiz →"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Quizzes Found"
            description="You don't have any assessments under this category right now. Check back when new diagnostic modules are released."
            actionLabel="View All Assessments"
            onAction={() => {
              setActiveTab("all");
              setSearchQuery("");
            }}
          />
        )}
      </div>
    </StudentShell>
  );
}
