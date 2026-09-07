"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    trainer,
    courses,
    trainees,
    submissions,
    liveClasses,
    certificates,
    conversations,
    setActiveModal,
  } = useTrainer();

  const pendingSubmissions = useMemo(() => {
    return submissions.filter((s) => s.status === "pending");
  }, [submissions]);

  const upcomingLive = useMemo(() => {
    return liveClasses.find((l) => l.status === "upcoming" || l.status === "live") || liveClasses[0];
  }, [liveClasses]);

  const pendingCerts = useMemo(() => {
    return certificates.filter((c) => c.status === "pending_approval");
  }, [certificates]);

  const urgentDoubts = useMemo(() => {
    return conversations.filter((c) => c.isUrgent || c.unreadCount > 0);
  }, [conversations]);

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* 1. WELCOME HERO */}
      <section className="trainer-hero-card" style={{ marginBottom: "28px" }}>
        <div className="trainer-hero-glow"></div>
        <div className="trainer-hero-left">
          <div className="trainer-hero-tag">
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a7f3d0" }}></span>
            IMD Faculty Mission Control &bull; {trainer.division}
          </div>
          <h1 className="trainer-hero-name">
            Welcome, {trainer.name} <span style={{ fontSize: "24px" }}>👨‍🏫</span>
          </h1>
          <p className="trainer-hero-desc">
            You are managing <strong>{trainer.activeCoursesCount} active courses</strong> with <strong>{trainer.totalStudents} enrolled IMD trainees</strong>. There are <strong>{pendingSubmissions.length} pending assignment submissions</strong> requiring evaluation today.
          </p>
          <div className="trainer-hero-actions">
            <button
              type="button"
              className="trainer-quick-btn trainer-btn-green"
              onClick={() => setActiveModal({ type: "new_course", data: null })}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Create New Course</span>
            </button>
            <button
              type="button"
              className="trainer-quick-btn trainer-btn-outline"
              onClick={() => setActiveModal({ type: "new_assignment", data: null })}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>Add Assignment</span>
            </button>
            <button
              type="button"
              className="trainer-quick-btn trainer-btn-outline"
              onClick={() => setActiveModal({ type: "schedule_live", data: null })}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              <span>Schedule Live Class</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. KPI STATS ROW */}
      <section className="trainer-stats-grid" style={{ marginBottom: "28px" }}>
        {/* Active Courses */}
        <div className="trainer-stat-card">
          <div className="trainer-stat-top">
            <div className="trainer-stat-icon-box trainer-stat-icon-emerald">📚</div>
            <span className="trainer-stat-badge trainer-stat-badge-green">Active</span>
          </div>
          <div className="trainer-stat-val">{courses.length}</div>
          <div className="trainer-stat-lbl">Managed Courses</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-light)", marginTop: "6px" }}>
            {courses.filter((c) => c.status === "active").length} Published &bull; {courses.filter((c) => c.status === "draft").length} Draft
          </div>
        </div>

        {/* Total Trainees */}
        <div className="trainer-stat-card">
          <div className="trainer-stat-top">
            <div className="trainer-stat-icon-box trainer-stat-icon-teal">👥</div>
            <span className="trainer-stat-badge trainer-stat-badge-green">+12 this batch</span>
          </div>
          <div className="trainer-stat-val">{trainer.totalStudents}</div>
          <div className="trainer-stat-lbl">Enrolled Trainees</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-light)", marginTop: "6px" }}>
            Across 8 IMD Specialized Centers
          </div>
        </div>

        {/* Pending Evaluations */}
        <div className="trainer-stat-card">
          <div className="trainer-stat-top">
            <div className="trainer-stat-icon-box trainer-stat-icon-amber">📝</div>
            <span className="trainer-stat-badge trainer-stat-badge-amber">Action Req.</span>
          </div>
          <div className="trainer-stat-val" style={{ color: "#d97706" }}>{pendingSubmissions.length}</div>
          <div className="trainer-stat-lbl">Pending Evaluations</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-light)", marginTop: "6px" }}>
            Avg. grading turnaround &lt; 24h
          </div>
        </div>

        {/* Pass Rate & Training Hours */}
        <div className="trainer-stat-card">
          <div className="trainer-stat-top">
            <div className="trainer-stat-icon-box trainer-stat-icon-indigo">🎓</div>
            <span className="trainer-stat-badge trainer-stat-badge-green">Exemplary</span>
          </div>
          <div className="trainer-stat-val">{trainer.averagePassRate}%</div>
          <div className="trainer-stat-lbl">Average Pass Rate</div>
          <div style={{ fontSize: "11.5px", color: "var(--tr-text-light)", marginTop: "6px" }}>
            {trainer.totalTrainingHours}h Live Training Delivered
          </div>
        </div>
      </section>

      {/* 3. 2-COLUMN MAIN DASHBOARD GRID */}
      <div className="trainer-grid-layout">
        {/* ==================== CENTER COLUMN ==================== */}
        <div className="trainer-center-column">
          {/* PENDING SUBMISSIONS GRADING DESK */}
          <div className="trainer-section-card">
            <div className="trainer-section-header">
              <div>
                <h2 className="trainer-section-title">
                  <span>📝</span> Pending Submissions for Evaluation
                </h2>
                <div className="trainer-section-subtitle">
                  Review trainee lab NetCDF code, scripts, and assign marks & feedback
                </div>
              </div>
              <Link href="/trainer/assignments" className="trainer-view-all-link">
                View All ({submissions.length}) &rarr;
              </Link>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--tr-text-muted)" }}>
                🎉 All trainee submissions are graded! No pending evaluations.
              </div>
            ) : (
              <div className="trainer-table-wrap">
                <table className="trainer-table">
                  <thead>
                    <tr>
                      <th>Trainee</th>
                      <th>Assignment & Course</th>
                      <th>Division</th>
                      <th>Submitted</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSubmissions.slice(0, 4).map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={sub.studentAvatar || "/images/student-img-1.jpg"}
                              alt={sub.studentName}
                              style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                            />
                            <div>
                              <div style={{ fontWeight: "700", color: "var(--tr-text-heading)" }}>{sub.studentName}</div>
                              <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>{sub.studentEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: "600", color: "var(--tr-text-heading)" }}>{sub.assignmentTitle}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>{sub.courseTitle}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: "12px", color: "var(--tr-text-body)" }}>{sub.division}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: "12px", color: "var(--tr-text-muted)" }}>
                            {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="trainer-quick-btn trainer-btn-green"
                            style={{ minHeight: "36px", padding: "8px 18px", fontSize: "12.5px", whiteSpace: "nowrap" }}
                            onClick={() => setActiveModal({ type: "grading", data: sub })}
                          >
                            Evaluate & Grade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ACTIVE COURSES OVERVIEW */}
          <div className="trainer-section-card">
            <div className="trainer-section-header">
              <div>
                <h2 className="trainer-section-title">
                  <span>📚</span> Managed Meteorological Courses
                </h2>
                <div className="trainer-section-subtitle">
                  Curriculum progress, enrolled trainees, and syllabus module management
                </div>
              </div>
              <Link href="/trainer/courses" className="trainer-view-all-link">
                Manage Courses &rarr;
              </Link>
            </div>

            <div className="trainer-courses-grid">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="trainer-course-card">
                  <div className="trainer-course-thumb-wrap">
                    <img src={course.thumbnail} alt={course.title} className="trainer-course-thumb" />
                    <span className={`trainer-course-status-pill ${course.status === "active" ? "pill-active" : "pill-draft"}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="trainer-course-body">
                    <span className="trainer-course-cat">{course.category}</span>
                    <h3 className="trainer-course-title">{course.title}</h3>
                    
                    <div className="trainer-course-stats-bar">
                      <span>👥 {course.enrolledCount} Trainees</span>
                      <span>📖 {course.totalModules} Modules</span>
                      <span>⏱️ {course.durationHours}h</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px", color: "var(--tr-text-muted)", fontWeight: "600" }}>
                      <span>Batch Completion</span>
                      <span style={{ color: "#059669", fontWeight: "700" }}>{course.completionRate}%</span>
                    </div>
                    <div className="trainer-progress-bar-wrap">
                      <div className="trainer-progress-bar-fill" style={{ width: `${course.completionRate}%` }}></div>
                    </div>

                    <div className="trainer-course-footer">
                      <Link
                        href="/trainer/courses"
                        className="trainer-quick-btn trainer-btn-outline"
                        style={{ flex: 1, justifyContent: "center", height: "34px", fontSize: "12.5px" }}
                      >
                        Edit Syllabus
                      </Link>
                      <button
                        type="button"
                        className="trainer-quick-btn trainer-btn-green"
                        style={{ height: "34px", padding: "0 12px", fontSize: "12.5px" }}
                        onClick={() => setActiveModal({ type: "schedule_live", data: course })}
                        title="Schedule Live Session for this course"
                      >
                        🎥
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== SIDE COLUMN ==================== */}
        <div className="trainer-side-column">
          {/* UPCOMING LIVE MASTERCLASS */}
          {upcomingLive && (
            <div className="trainer-section-card" style={{ background: "linear-gradient(135deg, #02231c 0%, #03362a 100%)", color: "#ffffff", border: "1px solid #064e3b" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <span className="trainer-live-indicator">
                  <span className="trainer-live-dot-pulse"></span>
                  Next Masterclass
                </span>
                <span style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: "700" }}>
                  {upcomingLive.day} {upcomingLive.month} 2026
                </span>
              </div>

              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", margin: "0 0 6px 0", lineHeight: 1.35 }}>
                {upcomingLive.title}
              </h3>
              <p style={{ fontSize: "12.5px", color: "#cbd5e1", margin: "0 0 14px 0" }}>
                {upcomingLive.courseName} &bull; {upcomingLive.time}
              </p>

              <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "10px 12px", borderRadius: "8px", fontSize: "12px", color: "#a7f3d0", marginBottom: "16px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                👥 {upcomingLive.registeredCount} Trainees Registered &bull; Batch 2025-26
              </div>

              <Link
                href="/trainer/live"
                className="trainer-quick-btn trainer-btn-green"
                style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
              >
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <span>Enter Live Studio &rarr;</span>
              </Link>
            </div>
          )}

          {/* BATCH PERFORMANCE & COMPETENCY */}
          <div className="trainer-section-card">
            <h3 className="trainer-section-title" style={{ fontSize: "16px", marginBottom: "14px" }}>
              <span>📊</span> Trainee Health & Tiers
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>
                  <span style={{ color: "#059669" }}>Exemplary (90%+)</span>
                  <span>48% (89 Trainees)</span>
                </div>
                <div className="trainer-progress-bar-wrap" style={{ height: "6px", marginBottom: 0 }}>
                  <div style={{ height: "100%", background: "#10b981", width: "48%" }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>
                  <span style={{ color: "#0d9488" }}>On Track (75% - 89%)</span>
                  <span>42% (78 Trainees)</span>
                </div>
                <div className="trainer-progress-bar-wrap" style={{ height: "6px", marginBottom: 0 }}>
                  <div style={{ height: "100%", background: "#0d9488", width: "42%" }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>
                  <span style={{ color: "#d97706" }}>Needs Attention (&lt;75%)</span>
                  <span>10% (19 Trainees)</span>
                </div>
                <div className="trainer-progress-bar-wrap" style={{ height: "6px", marginBottom: 0 }}>
                  <div style={{ height: "100%", background: "#f59e0b", width: "10%" }}></div>
                </div>
              </div>
            </div>

            <Link
              href="/trainer/students"
              style={{ display: "block", textAlign: "center", fontSize: "12.5px", fontWeight: "700", color: "var(--tr-accent-teal)", marginTop: "14px", textDecoration: "none" }}
            >
              View Trainee Roster & Gradebook &rarr;
            </Link>
          </div>

          {/* URGENT DOUBTS & MESSAGES */}
          <div className="trainer-section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 className="trainer-section-title" style={{ fontSize: "16px" }}>
                <span>💬</span> Trainee Doubts
              </h3>
              <Link href="/trainer/messages" style={{ fontSize: "12px", color: "var(--tr-accent-teal)", fontWeight: "700", textDecoration: "none" }}>
                View All
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {conversations.slice(0, 2).map((conv) => (
                <Link
                  key={conv.id}
                  href="/trainer/messages"
                  style={{ textDecoration: "none", padding: "10px 12px", background: "var(--tr-surface-alt)", borderRadius: "8px", border: "1px solid var(--tr-border)", display: "block" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "700", fontSize: "13px", color: "var(--tr-text-heading)" }}>{conv.studentName}</span>
                    <span style={{ fontSize: "10.5px", color: "var(--tr-text-light)" }}>{conv.lastMessage?.timestamp}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--tr-text-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {conv.lastMessage?.text}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* PENDING CERTIFICATES */}
          {pendingCerts.length > 0 && (
            <div className="trainer-section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 className="trainer-section-title" style={{ fontSize: "16px" }}>
                  <span>🎓</span> Pending Sign-Offs
                </h3>
                <span className="trainer-stat-badge trainer-stat-badge-amber">{pendingCerts.length} Pending</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {pendingCerts.slice(0, 2).map((cert) => (
                  <div key={cert.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--tr-surface-alt)", borderRadius: "8px" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)" }}>{cert.studentName}</div>
                      <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>{cert.courseTitle}</div>
                    </div>
                    <button
                      type="button"
                      className="trainer-quick-btn trainer-btn-outline"
                      style={{ height: "28px", padding: "0 8px", fontSize: "11.5px" }}
                      onClick={() => setActiveModal({ type: "certificate_preview", data: cert })}
                    >
                      Sign & Issue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </TrainerShell>
  );
}
