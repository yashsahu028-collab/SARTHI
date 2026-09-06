"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";

export default function AssignmentDetailPage({ params }) {
  const router = useRouter();
  // Next.js 16 unwrap params
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;

  const { assignments, submitAssignment } = useStudent();
  const assignment = assignments.find((a) => a.id === assignmentId) || assignments[0];

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !notes.trim()) {
      alert("Please upload at least one solution file or enter notes before submitting.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitAssignment(assignment.id, {
        files: selectedFiles.length > 0 ? selectedFiles : ["meteorological_solution.pdf"],
        notes: notes.trim(),
      });
      setSubmitting(false);
      setSubmitSuccess(true);
    }, 900);
  };

  if (!assignment) {
    return (
      <StudentShell>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Assignment not found</h2>
          <Link href="/dashboard/assignments">Return to Assignments</Link>
        </div>
      </StudentShell>
    );
  }

  const isPending = assignment.status === "pending";
  const isSubmitted = assignment.status === "submitted" || submitSuccess;
  const isGraded = assignment.status === "graded";

  return (
    <StudentShell>
      <div style={{ padding: "24px 32px 64px 32px", maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
        {/* Back Link */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/dashboard/assignments"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--sarthi-primary)",
              fontWeight: "700",
              fontSize: "12px",
              textDecoration: "none",
              background: "var(--sarthi-mint-50)",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid var(--sarthi-border)",
            }}
          >
            ← Return to Mission Control
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(360px, 0.9fr)", gap: "28px", alignItems: "start" }}>
          {/* Left Column: Mission Description & Brief */}
          <div style={{ background: "var(--sarthi-surface)", borderRadius: "24px", border: "1px solid var(--sarthi-border)", padding: "32px", boxShadow: "var(--sarthi-shadow-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--sarthi-emerald)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {assignment.courseTitle}
              </span>
              <span
                style={{
                  background: isGraded ? "var(--sarthi-mint-100)" : isSubmitted ? "#e0f2fe" : "#fef3c7",
                  color: isGraded ? "var(--sarthi-pine-dark)" : isSubmitted ? "#0369a1" : "#b45309",
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                }}
              >
                {isGraded ? `Score: ${assignment.score}/${assignment.maxScore} XP` : isSubmitted ? "Submitted" : "Pending"}
              </span>
            </div>

            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "0 0 16px 0", lineHeight: 1.3 }}>
              {assignment.title}
            </h1>

            {/* Badges Bar */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
              <div style={{ background: "var(--sarthi-surface-subtle)", border: "1px solid var(--sarthi-border-light)", borderRadius: "10px", padding: "6px 12px", fontSize: "11px", fontWeight: "700" }}>
                🎯 Max Score: <strong style={{ color: "var(--sarthi-primary)" }}>{assignment.maxScore} XP</strong>
              </div>
              <div style={{ background: "var(--sarthi-surface-subtle)", border: "1px solid var(--sarthi-border-light)", borderRadius: "10px", padding: "6px 12px", fontSize: "11px", fontWeight: "700" }}>
                📅 Deadline: <strong>{assignment.dueDateFormatted}</strong>
              </div>
              <div style={{ background: "var(--sarthi-surface-subtle)", border: "1px solid var(--sarthi-border-light)", borderRadius: "10px", padding: "6px 12px", fontSize: "11px", fontWeight: "700" }}>
                ⚖️ Passing Score: <strong>{assignment.passingScore}%</strong>
              </div>
            </div>

            {/* Objective & Markdown Body */}
            <div style={{ color: "var(--sarthi-text-body)", fontSize: "13.5px", lineHeight: 1.7, marginBottom: "32px" }}>
              <div
                style={{
                  background: "var(--sarthi-mint-50)",
                  border: "1px solid var(--sarthi-border)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ margin: "0 0 6px 0", color: "var(--sarthi-pine-dark)", fontSize: "13px", fontWeight: "800" }}>
                  Operational IMD Requirement
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--sarthi-text-body)" }}>
                  This task directly exercises operational data pipelines used at Mausam Bhawan. Ensure all calculations adhere to standard WMO-No. 8 formatting guidelines.
                </p>
              </div>

              <div style={{ whiteSpace: "pre-line" }}>
                {assignment.description}
              </div>
            </div>

            {/* Instructor Details Card */}
            <div style={{ borderTop: "1px solid var(--sarthi-border-light)", paddingTop: "20px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-text-light)", textTransform: "uppercase" }}>
                Evaluating Faculty
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                <img
                  src={assignment.instructor?.avatar || "/images/student-img-1.jpg"}
                  alt={assignment.instructor?.name}
                  style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: "800", color: "var(--sarthi-text-heading)" }}>
                    {assignment.instructor?.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted)" }}>
                    {assignment.instructor?.email} • IMD Division Lead
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Submission Console */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Graded Feedback Card */}
            {isGraded && (
              <div style={{ background: "#ffffff", borderRadius: "20px", border: "2px solid #bef264", padding: "24px", boxShadow: "var(--sarthi-shadow-card)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "20px" }}>🏆</span>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: 0 }}>
                    Mission Graded: {assignment.score} / {assignment.maxScore} XP
                  </h3>
                </div>
                <p style={{ fontSize: "13px", color: "var(--sarthi-text-body)", lineHeight: 1.6, margin: "0 0 16px 0", background: "var(--sarthi-mint-50)", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--sarthi-border)" }}>
                  <strong>Instructor Feedback:</strong><br />
                  {assignment.feedback}
                </p>
                <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted)" }}>
                  Submitted on: {new Date(assignment.submittedAt).toLocaleDateString()}
                </div>
              </div>
            )}

            {/* Submitted State Card */}
            {isSubmitted && !isGraded && (
              <div style={{ background: "#f0fdf4", borderRadius: "20px", border: "1px solid var(--sarthi-border)", padding: "24px", boxShadow: "var(--sarthi-shadow-card)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--sarthi-pine-dark)", margin: 0 }}>
                    Mission Successfully Submitted
                  </h3>
                </div>
                <p style={{ fontSize: "12px", color: "var(--sarthi-text-muted)", margin: "0 0 16px 0" }}>
                  Your solution has been transmitted to {assignment.instructor?.name}. You will receive score notification once reviewed.
                </p>
                <div style={{ background: "#ffffff", borderRadius: "12px", padding: "12px", border: "1px solid var(--sarthi-border)" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-text-light)", textTransform: "uppercase" }}>
                    Archived Attachments:
                  </span>
                  <ul style={{ margin: "6px 0 0 0", paddingLeft: "20px", fontSize: "12px", color: "var(--sarthi-primary)" }}>
                    {assignment.submissionFiles && assignment.submissionFiles.length > 0 ? (
                      assignment.submissionFiles.map((f, i) => <li key={i}>{f}</li>)
                    ) : (
                      <li>insat3dr_radiance_report.pdf</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Submission Form (If Pending) */}
            {isPending && !submitSuccess && (
              <div style={{ background: "var(--sarthi-surface)", borderRadius: "24px", border: "1px solid var(--sarthi-border)", padding: "28px", boxShadow: "var(--sarthi-shadow-card)" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "0 0 6px 0" }}>
                  Submit Your Solution
                </h3>
                <p style={{ fontSize: "12px", color: "var(--sarthi-text-muted)", margin: "0 0 20px 0" }}>
                  Upload your analytical code scripts, NetCDF plots, and mission writeup.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Drag and Drop Zone */}
                  <div
                    style={{
                      border: "2px dashed var(--sarthi-border)",
                      borderRadius: "16px",
                      padding: "24px",
                      textAlign: "center",
                      background: "var(--sarthi-surface-subtle)",
                      cursor: "pointer",
                      marginBottom: "16px",
                    }}
                  >
                    <input
                      type="file"
                      id="asn-file-upload"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      accept=".pdf,.py,.ipynb,.zip,.nc,.h5,.png,.jpg"
                    />
                    <label htmlFor="asn-file-upload" style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>📤</div>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--sarthi-text-heading)", margin: "0 0 4px 0" }}>
                        Click to browse or drop files here
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--sarthi-text-light)", margin: 0 }}>
                        Supported: PDF, Python (.py, .ipynb), NetCDF (.nc), ZIP, PNG
                      </p>
                    </label>
                  </div>

                  {/* Selected Files List */}
                  {selectedFiles.length > 0 && (
                    <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "var(--sarthi-mint-50)",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        >
                          <span style={{ fontWeight: "600", color: "var(--sarthi-pine-dark)" }}>📄 {file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "800" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes Textarea */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--sarthi-text-heading)", marginBottom: "6px" }}>
                      Notes for Faculty
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mention algorithms used, parameters tuned, or questions for Dr. Sharma..."
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "1px solid var(--sarthi-border)",
                        fontSize: "12.5px",
                        outline: "none",
                        fontFamily: "inherit",
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "12px",
                      border: "none",
                      background: "var(--sarthi-primary)",
                      color: "#ffffff",
                      fontWeight: "800",
                      fontSize: "12px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      cursor: submitting ? "not-allowed" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                      boxShadow: "0 6px 20px rgba(16, 185, 129, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {submitting ? "Transmitting Solution..." : "Submit Mission Work →"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
