"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";

export default function AssessmentRunnerPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;

  const { quizzes, submitQuizAttempt } = useStudent();
  const quiz = quizzes.find((q) => q.id === quizId) || quizzes[0];

  // User answers map: { [questionIndex]: selectedOptionIndex }
  const [answers, setAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState((quiz?.durationMin || 15) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const outcome = submitQuizAttempt(quiz.id, answers);
      setResult(outcome);
      setIsSubmitting(false);
    }, 700);
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  // Countdown timer
  useEffect(() => {
    if (result) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [result]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <StudentShell>
        <div style={{ padding: "60px", textAlign: "center" }}>
          <h2>Assessment Protocol not configured</h2>
          <Link href="/dashboard/quiz">Return to Quiz Hub</Link>
        </div>
      </StudentShell>
    );
  }

  // If completed, show scorecard
  if (result) {
    return (
      <StudentShell>
        <div style={{ padding: "32px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "28px",
              border: "1px solid var(--sarthi-border)",
              boxShadow: "var(--sarthi-shadow-card)",
              padding: "48px 36px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: result.passed ? "var(--sarthi-mint-100)" : "#fee2e2",
                color: result.passed ? "var(--sarthi-primary)" : "#ef4444",
                fontSize: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
              }}
            >
              {result.passed ? "✓" : "!"}
            </div>

            <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--sarthi-emerald)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              ASSESSMENT EVALUATION LOGGED
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "var(--sarthi-text-heading)", margin: "8px 0 16px 0" }}>
              {result.passed ? "Objective Cleared with Honors" : "Protocol Completed"}
            </h1>

            {/* Big Yield Gauge */}
            <div
              style={{
                background: "var(--sarthi-mint-50)",
                border: "1px solid var(--sarthi-border)",
                borderRadius: "20px",
                padding: "24px",
                maxWidth: "280px",
                margin: "0 auto 28px auto",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--sarthi-text-light)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                ACCURACY YIELD
              </div>
              <div style={{ fontSize: "52px", fontWeight: "900", color: "var(--sarthi-primary)", lineHeight: 1.1, margin: "6px 0" }}>
                {result.percentage}%
              </div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--sarthi-pine-dark)" }}>
                {result.score} of {result.maxScore} Questions Correct (+{result.pointsEarned} XP)
              </div>
            </div>

            <p style={{ fontSize: "13.5px", color: "var(--sarthi-text-muted)", maxWidth: "480px", margin: "0 auto 32px auto", lineHeight: 1.6 }}>
              {result.passed
                ? "Your answers demonstrate high competency in numerical parameterization and spectral channel discernment. XP points have been credited to your trainee profile."
                : "Good attempt! Review the question explanations and re-initialize the assessment to improve your score."}
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link
                href="/dashboard/quiz"
                style={{
                  padding: "12px 28px",
                  borderRadius: "12px",
                  background: "var(--sarthi-primary)",
                  color: "#ffffff",
                  fontWeight: "800",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.25)",
                }}
              >
                Return to Quiz Hub →
              </Link>
            </div>
          </div>
        </div>
      </StudentShell>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = secondsRemaining < 180; // under 3 minutes

  return (
    <StudentShell>
      <div style={{ padding: "24px 32px 64px 32px", maxWidth: "1050px", margin: "0 auto", width: "100%" }}>
        {/* Top Control Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            background: "var(--sarthi-surface)",
            padding: "14px 20px",
            borderRadius: "16px",
            border: "1px solid var(--sarthi-border)",
            boxShadow: "var(--sarthi-shadow-card)",
          }}
        >
          <Link
            href="/dashboard/quiz"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: "800",
              color: "var(--sarthi-text-muted)",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            ← Abort Protocol
          </Link>

          {/* Live Timer Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: isTimeCritical ? "#fee2e2" : "var(--sarthi-mint-100)",
              color: isTimeCritical ? "#dc2626" : "var(--sarthi-pine-dark)",
              padding: "6px 14px",
              borderRadius: "999px",
              fontWeight: "800",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            <span>⏱️</span>
            <span>{formatTime(secondsRemaining)} REMAINING</span>
          </div>

          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-text-light)" }}>
            Answered: <strong style={{ color: "var(--sarthi-primary)" }}>{answeredCount}</strong>/{quiz.questions.length}
          </div>
        </div>

        {/* Quiz Info Banner */}
        <div style={{ background: "var(--sarthi-surface)", borderRadius: "24px", border: "1px solid var(--sarthi-border)", padding: "28px", marginBottom: "24px", boxShadow: "var(--sarthi-shadow-card)" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--sarthi-emerald)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            {quiz.courseName}
          </span>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "4px 0 12px 0" }}>
            {quiz.title}
          </h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ background: "var(--sarthi-surface-subtle)", border: "1px solid var(--sarthi-border-light)", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700" }}>
              Questions: {quiz.questions.length}
            </span>
            <span style={{ background: "var(--sarthi-surface-subtle)", border: "1px solid var(--sarthi-border-light)", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700" }}>
              Passing Threshold: {quiz.passingScore}%
            </span>
            <span style={{ background: "var(--sarthi-surface-subtle)", border: "1px solid var(--sarthi-border-light)", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700" }}>
              Value: {quiz.totalPoints} XP
            </span>
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
          {quiz.questions.map((q, qIndex) => {
            const selectedOpt = answers[qIndex];

            return (
              <div
                key={q.id}
                style={{
                  background: "var(--sarthi-surface)",
                  borderRadius: "20px",
                  border: "1px solid var(--sarthi-border)",
                  padding: "24px",
                  boxShadow: "var(--sarthi-shadow-card)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: selectedOpt !== undefined ? "var(--sarthi-primary)" : "var(--sarthi-mint-100)",
                      color: selectedOpt !== undefined ? "#ffffff" : "var(--sarthi-pine-dark)",
                      fontSize: "12px",
                      fontWeight: "800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {qIndex + 1}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--sarthi-text-light)", textTransform: "uppercase" }}>
                    Operational Item
                  </span>
                </div>

                <h3 style={{ fontSize: "15.5px", fontWeight: "700", color: "var(--sarthi-text-heading)", margin: "0 0 18px 0", lineHeight: 1.45 }}>
                  {q.question}
                </h3>

                {/* Options List */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  {q.options.map((optionText, optIndex) => {
                    const isSelected = selectedOpt === optIndex;
                    return (
                      <label
                        key={optIndex}
                        onClick={() => setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "14px 18px",
                          borderRadius: "14px",
                          border: isSelected ? "2px solid var(--sarthi-primary)" : "1px solid var(--sarthi-border-light)",
                          background: isSelected ? "var(--sarthi-mint-50)" : "var(--sarthi-surface-subtle)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            border: isSelected ? "5px solid var(--sarthi-primary)" : "2px solid #cbd5e1",
                            background: "#ffffff",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: "13px", fontWeight: isSelected ? "700" : "500", color: isSelected ? "var(--sarthi-text-heading)" : "var(--sarthi-text-body)" }}>
                          {optionText}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Bar */}
        <div
          style={{
            position: "sticky",
            bottom: "20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "16px 24px",
            borderRadius: "20px",
            border: "1px solid var(--sarthi-border)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--sarthi-text-muted)" }}>
            Answered <strong>{answeredCount}</strong> of <strong>{quiz.questions.length}</strong> questions
          </div>

          <button
            type="button"
            disabled={answeredCount === 0 || isSubmitting}
            onClick={handleSubmit}
            style={{
              padding: "12px 28px",
              borderRadius: "12px",
              border: "none",
              background: answeredCount === 0 ? "#e2e8f0" : "var(--sarthi-primary)",
              color: answeredCount === 0 ? "#94a3b8" : "#ffffff",
              fontWeight: "800",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: answeredCount === 0 ? "not-allowed" : "pointer",
              boxShadow: answeredCount === 0 ? "none" : "0 6px 20px rgba(16, 185, 129, 0.25)",
            }}
          >
            {isSubmitting ? "Transmitting & Scoring..." : "Submit Assessment →"}
          </button>
        </div>
      </div>
    </StudentShell>
  );
}
