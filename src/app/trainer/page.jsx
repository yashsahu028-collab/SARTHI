"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";
import { FloatMotion } from "@/components/motion/MotionWrapper";
import { CourseThumbnail } from "@/lib/services/courseVisuals";
import "@/app/dashboard/dashboard.css";

function ProgressIcon({ type }) {
  const iconProps = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (type) {
    case "satellite":
      return (
        <svg {...iconProps}>
          <path d="M13 7 9 3 5 7l4 4" />
          <path d="m17 11 4 4-4 4-4-4" />
          <path d="m8 12 4 4" />
          <path d="m16 8 4-4" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "radar":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 6a6 6 0 0 1 6 6" />
          <circle cx="12" cy="12" r="2" />
          <line x1="12" y1="12" x2="19" y2="5" />
        </svg>
      );
    case "nwp":
      return (
        <svg {...iconProps}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "monsoon":
      return (
        <svg {...iconProps}>
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M16 14v6" />
          <path d="M8 14v6" />
          <path d="M12 16v6" />
        </svg>
      );
    case "disaster":
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
  }
}

export default function TrainerDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    trainer,
    courses,
    submissions,
    liveClasses,
    quizzes,
    certificates,
    setActiveModal,
  } = useTrainer();

  const pendingSubmissions = useMemo(() => {
    return (submissions || []).filter((s) => s.status === "pending");
  }, [submissions]);

  const upcomingLive = useMemo(() => {
    return (
      (liveClasses || []).find((l) => l.status === "upcoming" || l.status === "live" || l.status === "scheduled") ||
      (liveClasses || [])[0] || {
        id: "live-1",
        title: "Power BI & DAX Architectural Masterclass",
        courseName: "Power BI Mastery — From Data to Decisions",
        day: "07",
        month: "SEP",
        time: "10:00 AM",
        registeredCount: 84,
      }
    );
  }, [liveClasses]);

  const pendingCerts = useMemo(() => {
    return (certificates || []).filter((c) => c.status === "pending_approval");
  }, [certificates]);

  // Primary active batch course
  const activeCourse =
    (courses || []).find((c) => c.status === "active") ||
    (courses || [])[0] || {
      id: "course_power_bi_mastery_2026",
      title: "Power BI Mastery — From Data to Decisions",
      category: "Business Analytics",
      enrolledCount: 84,
      totalLessons: 48,
      durationHours: 18,
      progress: 72,
      nextLesson: "Practical Lab 1: Star Schema & ETL Pipeline",
      thumbnail: "/images/satellite-meteorology-thumb.jpg",
    };

  // Batch Competencies Data
  const batchCompetencies = [
    { id: 1, name: "Power Query ETL & Star Schema", pct: 92, iconType: "satellite" },
    { id: 2, name: "Advanced DAX & Time Intelligence", pct: 88, iconType: "radar" },
    { id: 3, name: "Data Modeling & Cardinality Flows", pct: 86, iconType: "nwp" },
    { id: 4, name: "Executive KPI Dashboard Visualization", pct: 94, iconType: "monsoon" },
    { id: 5, name: "Financial Sensitivity & What-If Parameters", pct: 82, iconType: "disaster" },
  ];

  // Weekly instruction hours (Mini Histogram)
  const weeklyInstructionHours = [
    { day: "M", hours: 3.5, max: 4.5 },
    { day: "T", hours: 4.0, max: 4.5 },
    { day: "W", hours: 2.5, max: 4.5 },
    { day: "T", hours: 4.2, max: 4.5 },
    { day: "F", hours: 2.8, max: 4.5 },
    { day: "S", hours: 0.0, max: 4.5 },
    { day: "S", hours: 0.0, max: 4.5 },
  ];

  // Filtered courses for catalog grid
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses || [];
    return (courses || []).filter(
      (c) =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  // Recent faculty activities dynamically derived from live submissions, quizzes, and live classes
  const recentFacultyActivities = useMemo(() => {
    const list = [];
    const graded = (submissions || []).filter((s) => s.status === "graded");
    if (graded.length > 0) {
      list.push({
        id: `act-graded-${graded[0].id}`,
        type: "green",
        title: `Graded: ${graded[0].assignmentTitle} (${graded[0].studentName})`,
        time: "Recently graded",
      });
    }
    if ((quizzes || []).length > 0) {
      list.push({
        id: `act-quiz-${quizzes[0].id}`,
        type: "blue",
        title: `Published: ${quizzes[0].title}`,
        time: "Active assessment",
      });
    }
    if ((liveClasses || []).length > 0) {
      list.push({
        id: `act-live-${liveClasses[0].id}`,
        type: "purple",
        title: `Scheduled: ${liveClasses[0].title}`,
        time: `${liveClasses[0].day} ${liveClasses[0].month} · ${liveClasses[0].time}`,
      });
    }
    if (list.length === 0) {
      return [
        { id: "act-1", type: "green", title: "Graded: Practical Lab 1 (Mohit Raj)", time: "10 mins ago" },
        { id: "act-2", type: "blue", title: "Published: DAX & Data Modeling Assessment", time: "1 hour ago" },
        { id: "act-3", type: "purple", title: "Completed: Live Masterclass (84 attended)", time: "Yesterday" },
      ];
    }
    return list;
  }, [submissions, quizzes, liveClasses]);

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* ----------------------------------------------------------------
          DASHBOARD 2-COLUMN GRID (Exact twin of Student Dashboard)
          ---------------------------------------------------------------- */}
      <div className="db-grid-layout">
        {/* ==============================================================
            CENTER COLUMN
            ============================================================== */}
        <div className="db-center-column">
          {/* 1. WELCOME HERO (Identical cards & mascot) */}
          <section className="db-hero-card">
            <div className="db-hero-wave-bg"></div>

            <div className="db-hero-left">
              <p className="db-hero-greeting">Welcome back,</p>
              <h1 className="db-hero-name">
                {trainer.name} <span className="db-hero-wave-emoji">👨‍🏫</span>
              </h1>
              <p className="db-hero-tagline">“Empowering India’s Meteorological Workforce.”</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                <Link href="/trainer/live" className="db-hero-action-btn" style={{ textDecoration: "none" }}>
                  Launch Live Studio →
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveModal({ type: "new_course", data: null })}
                  style={{
                    background: "#ffffff",
                    color: "#000000",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.2s ease",
                  }}
                >
                  + New Course
                </button>
              </div>
            </div>

            {/* Mascot Center Area with robot & blinking eyes */}
            <div className="db-hero-mascot-area">
              <span className="db-mascot-label">Faculty Mission Control!</span>
              <FloatMotion duration={5} style={{ position: "relative", zIndex: 5 }}>
                <div className="home-header-image-wrap db-mascot-wrapper" style={{ position: "relative", zIndex: 5 }}>
                  <img
                    src="/images/home-header-robo-imge.png"
                    alt="Green robot character holding a stack of books."
                    className="home-header-image db-mascot-img"
                  />
                  <div className="robo-eye-animation">
                    <div className="robo-eye"></div>
                  </div>
                  <div className="robo-eye-animation right">
                    <div className="robo-eye"></div>
                  </div>
                </div>
              </FloatMotion>
              <svg className="db-floating-leaf leaf-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              </svg>
            </div>

            {/* Right Pillars List */}
            <div className="db-hero-pillars">
              <div className="db-pillar-item">
                <svg className="db-pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Instruct</span>
              </div>
              <div className="db-pillar-item">
                <svg className="db-pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span>Evaluate</span>
              </div>
              <div className="db-pillar-item">
                <svg className="db-pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Mentor</span>
              </div>
              <div className="db-pillar-item">
                <svg className="db-pillar-icon" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>Certify</span>
              </div>
            </div>
          </section>

          {/* 2. STATS ROW (4 CARDS - Exact twin of Student Dashboard) */}
          <section className="db-stats-row">
            {/* Card 1: Active Courses */}
            <div className="db-stat-card" onClick={() => router.push("/trainer/courses")} style={{ cursor: "pointer" }}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box green">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{courses.length}</span>
                  <span className="db-stat-label">Active Courses</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Card 2: Enrolled Trainees */}
            <div className="db-stat-card" onClick={() => router.push("/trainer/students")} style={{ cursor: "pointer" }}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box purple">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{trainer.totalStudents || 248}</span>
                  <span className="db-stat-label">Enrolled Trainees</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Card 3: Pending Reviews */}
            <div className="db-stat-card" onClick={() => router.push("/trainer/assignments")} style={{ cursor: "pointer" }}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box green">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <line x1="9" y1="12" x2="15" y2="12"></line>
                    <line x1="9" y1="16" x2="13" y2="16"></line>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{pendingSubmissions.length}</span>
                  <span className="db-stat-label">Pending Reviews</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Card 4: Avg Pass Rate */}
            <div className="db-stat-card" onClick={() => router.push("/trainer/analytics")} style={{ cursor: "pointer" }}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box gold">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{trainer.averagePassRate || 94}%</span>
                  <span className="db-stat-label">Avg Pass Rate</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </section>

          {/* 3. ACTIVE BATCH SPOTLIGHT (Exact twin of db-continue-learning-card) */}
          <section className="db-continue-learning-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Active Batch Instruction</h3>
              <Link href="/trainer/courses" className="db-view-all-link">
                View all courses →
              </Link>
            </div>

            <div className="db-continue-learning-card">
              <div className="db-course-graphic-thumbnail">
                <img
                  src={activeCourse.thumbnail || "/images/satellite-meteorology-thumb.jpg"}
                  alt={activeCourse.title}
                  className="db-thumbnail-bg-img"
                />
                <div className="db-thumbnail-overlay"></div>
                <div className="db-thumbnail-badge">ACTIVE BATCH</div>
                <div className="db-thumbnail-play-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                </div>
                <div className="db-thumbnail-title">{activeCourse.title}</div>
              </div>

              <div className="db-continue-details">
                <h4 className="db-continue-course-title">{activeCourse.title}</h4>
                <p className="db-next-lesson-text">
                  IMD Faculty: {trainer.name} • Next Live: {upcomingLive.title || upcomingLive.topic} ({upcomingLive.time})
                </p>

                <div className="db-progress-bar-wrap">
                  <div className="db-progress-track">
                    <div
                      className="db-progress-fill"
                      style={{ width: `${activeCourse.progress || 72}%` }}
                    ></div>
                  </div>
                  <span className="db-progress-percent">{activeCourse.progress || 72}%</span>
                </div>

                <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <Link href="/trainer/live" className="db-continue-btn" style={{ textDecoration: "none" }}>
                    <svg className="db-play-triangle" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span>Enter Live Studio</span>
                  </Link>
                  <Link
                    href="/trainer/assignments"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "700",
                      background: "var(--sarthi-surface-subtle, #f1f5f3)",
                      color: "var(--sarthi-text-heading, #0a2920)",
                      border: "1px solid var(--sarthi-border, #e2e8f0)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Grading Desk ({pendingSubmissions.length}) →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. BATCH COMPETENCY & MASTERY (Exact twin of db-progress-card) */}
          <section className="db-progress-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Batch Competency & Mastery</h3>
              <Link href="/trainer/analytics" className="db-view-all-link">
                View analytics →
              </Link>
            </div>

            <div className="db-progress-card">
              <div className="db-progress-main-row">
                {/* Left: Circular Donut Gauge */}
                <div className="db-donut-chart-container">
                  <svg className="db-donut-svg" viewBox="0 0 140 140" aria-label={`Batch average pass rate ${trainer.averagePassRate || 94}%`}>
                    <circle
                      className="db-donut-track"
                      cx="70"
                      cy="70"
                      r="54"
                    />
                    <circle
                      className="db-donut-fill"
                      cx="70"
                      cy="70"
                      r="54"
                      strokeDasharray={339.29}
                      strokeDashoffset={339.29 - (339.29 * (trainer.averagePassRate || 94)) / 100}
                    />
                  </svg>
                  <div className="db-donut-center-text">
                    <span className="db-donut-percent">{trainer.averagePassRate || 94}%</span>
                    <span className="db-donut-label">Batch Avg</span>
                  </div>
                </div>

                {/* Right: Progress List Rows */}
                <div className="db-competency-list">
                  {batchCompetencies.map((comp) => (
                    <div key={comp.id} className="db-competency-row">
                      <div className="db-comp-header">
                        <div className="db-comp-left">
                          <div className="db-comp-icon-box">
                            <ProgressIcon type={comp.iconType} />
                          </div>
                          <span className="db-comp-name" title={comp.name}>{comp.name}</span>
                        </div>
                        <span className="db-comp-pct">{comp.pct}%</span>
                      </div>
                      <div className="db-comp-bar-track">
                        <div
                          className="db-comp-bar-fill"
                          style={{ width: `${comp.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: Certification Milestone Callout */}
              <div className="db-cert-banner">
                <div className="db-cert-left">
                  <div className="db-cert-icon-wrap" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <div className="db-cert-text-wrap">
                    <h5 className="db-cert-title">
                      {pendingCerts.length > 0 ? `${pendingCerts.length} Pending Endorsements Awaiting Review` : "Batch 2025-26 on track for completion"}
                    </h5>
                    <p className="db-cert-subtitle">IMD Trainee Meteorologist & NWP Operational Certification Batch</p>
                  </div>
                </div>
                <Link href="/trainer/certificates" className="db-cert-claim-btn">
                  Review Approvals →
                </Link>
              </div>
            </div>
          </section>

          {/* 5. FACULTY COURSE CATALOG (Exact twin of db-recommended-grid) */}
          <section className="db-recommended-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Faculty Course Catalog</h3>
              <Link href="/trainer/courses" className="db-view-all-link">
                View catalog ({courses.length}) →
              </Link>
            </div>

            <div className="db-recommended-grid">
              {filteredCourses.slice(0, 4).map((course) => (
                <Link key={course.id} href="/trainer/courses" className="db-rec-card-apple">
                  <div className="db-rec-thumb-wrap">
                    <CourseThumbnail courseId={course.id} src={course.thumbnail} alt={course.title} />
                    {course.category && (
                      <span className="db-rec-category-badge">{course.category}</span>
                    )}
                  </div>
                  <div className="db-rec-body">
                    <h4 className="db-rec-course-title" title={course.title}>
                      {course.title}
                    </h4>
                    <div className="db-rec-instructor-row">
                      <span className="db-rec-instructor-name">{course.enrolledCount || 84} Trainees</span>
                      <span className="db-rec-dot">·</span>
                      <span className="db-rec-lesson-count">{course.totalLessons || 36} Lessons</span>
                    </div>
                    <div className="db-rec-action-link">
                      <span>Manage curriculum</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ==============================================================
            RIGHT UTILITY COLUMN (Exact twin of Student Dashboard)
            ============================================================== */}
        <aside className="db-right-column">
          {/* 1. UPCOMING LIVE SESSIONS */}
          <div className="db-upcoming-card">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ fontSize: "16px" }}>
                Upcoming Live Sessions
              </h3>
              <Link href="/trainer/live" className="db-view-all-link">
                Studio →
              </Link>
            </div>

            <div className="db-upcoming-list">
              {(liveClasses && liveClasses.length > 0 ? liveClasses.slice(0, 3) : [
                { id: "live-1", title: "INSAT-3DR Multi-Spectral Radiance", day: "07", month: "SEP", time: "10:00 AM", status: "upcoming", registeredCount: 84 },
                { id: "live-2", title: "Doppler Radar Reflectivity & VAD Analysis", day: "09", month: "SEP", time: "02:30 PM", status: "upcoming", registeredCount: 68 },
                { id: "live-3", title: "WRF Mesoscale Data Assimilation Hands-on", day: "12", month: "SEP", time: "11:00 AM", status: "upcoming", registeredCount: 92 },
              ]).map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push("/trainer/live")}
                  className="db-upcoming-item"
                  style={{ cursor: "pointer" }}
                >
                  <div className="db-upcoming-left">
                    <div className="db-calendar-badge">
                      <span className="db-cal-day">{item.day || "07"}</span>
                      <span className="db-cal-month">{item.month || "SEP"}</span>
                    </div>
                    <div className="db-upcoming-info">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <h4 className="db-upcoming-title">{item.title || item.topic}</h4>
                        {item.status === "live" && (
                          <span style={{ background: "#ef4444", color: "#fff", fontSize: "8px", fontWeight: "800", padding: "1px 5px", borderRadius: "4px" }}>
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="db-upcoming-time">{item.time} · {item.registeredCount || 84} Trainees</p>
                      <p className="db-upcoming-author">Batch 2025-26 · National Studio</p>
                    </div>
                  </div>
                  <svg className="db-upcoming-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* 2. RECENT FACULTY ACTIVITY */}
          <div className="db-activity-card">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ fontSize: "16px" }}>
                Faculty Activity
              </h3>
              <Link href="/trainer/analytics" className="db-view-all-link">
                View all →
              </Link>
            </div>

            <div className="db-activity-list">
              {recentFacultyActivities.map((act) => (
                <div key={act.id} className="db-activity-item">
                  <div className={`db-activity-icon-circle ${act.type}`}>
                    {act.type === "green" && (
                      <svg className="db-act-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                    {act.type === "blue" && (
                      <svg className="db-act-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    )}
                    {act.type === "purple" && (
                      <svg className="db-act-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    )}
                    {act.type === "gold" && (
                      <svg className="db-act-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a1 1 0 0 1 1 1v1h4a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4h-.1a5 5 0 0 1-3.9 3.9V18h3a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h3v-2.1A5 5 0 0 1 6.1 12H6a4 4 0 0 1-4-4V5a1 1 0 0 1 1-1h4V3a1 1 0 0 1 1-1h4zM4 6v2a2 2 0 0 0 2 2h.2c.1-.7.4-1.4.8-2H4zm14 2V6h-3c.4.6.7 1.3.8 2h2.2z" />
                      </svg>
                    )}
                  </div>
                  <div className="db-activity-details">
                    <p className="db-activity-text">{act.title}</p>
                    <p className="db-activity-time">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. WEEKLY INSTRUCTION TARGET CARD (With 7-Day Mini Histogram) */}
          <div className="db-target-card">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ fontSize: "16px", fontWeight: "700" }}>
                Instruction Target
              </h3>
              <span className="db-target-pct-badge">85% Met</span>
            </div>

            <div className="db-target-stats">
              <span className="db-target-value">
                17.0 <span className="db-target-subtext">/ 20 hrs</span>
              </span>
              <span className="db-target-goal">3.0 hrs to weekly quota</span>
            </div>

            <div className="db-target-bar-wrap">
              <div className="db-target-bar-fill" style={{ width: "85%" }} />
            </div>

            <div className="db-target-histogram-header">
              <span className="db-target-hist-title">Weekly Lecture Breakdown</span>
              <span className="db-target-hist-target">Target: 3.5h / day</span>
            </div>

            {/* 7-Day Mini Histogram */}
            <div className="db-target-days-grid">
              {weeklyInstructionHours.map((d, i) => (
                <div key={i} className="db-target-day-col">
                  <span className="db-target-day-hours">{d.hours}h</span>
                  <div className="db-target-day-pill">
                    <div
                      className="db-target-day-fill"
                      style={{
                        height: `${(d.hours / d.max) * 100}%`,
                        background: d.hours >= 3 ? "#059669" : "#10b981",
                      }}
                    />
                  </div>
                  <span className="db-target-day-name">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="db-target-footer">
              <span className="db-target-footer-dot" />
              <span>Avg. 3.4h / day · On track for IMD Semester faculty target</span>
            </div>
          </div>

          {/* 4. PENDING EVALUATIONS (Exact twin of db-deadlines-card) */}
          <div className="db-deadlines-card">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ fontSize: "16px", fontWeight: "700" }}>
                Pending Evaluations
              </h3>
              <Link href="/trainer/assignments" className="db-view-all-link">
                View all ({pendingSubmissions.length}) →
              </Link>
            </div>

            <div className="db-deadlines-list">
              {(pendingSubmissions.length > 0
                ? pendingSubmissions.slice(0, 3)
                : [
                    { id: "sub-1", studentName: "Mohit Raj", assignmentTitle: "INSAT-3DR Radiance Analysis Lab", submittedAt: "2h ago" },
                    { id: "sub-2", studentName: "Ananya Sharma", assignmentTitle: "WRF Boundary Layer Modeling", submittedAt: "4h ago" },
                    { id: "sub-3", studentName: "Rohan Patel", assignmentTitle: "Doppler Velocity Interpretation", submittedAt: "1d ago" },
                  ]
              ).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setActiveModal({ type: "grade_submission", data: task })}
                  className="db-deadline-item"
                  style={{ cursor: "pointer" }}
                >
                  <div className="db-deadline-left">
                    <div className="db-deadline-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        <line x1="9" y1="12" x2="15" y2="12"></line>
                        <line x1="9" y1="16" x2="13" y2="16"></line>
                      </svg>
                    </div>
                    <div className="db-deadline-content">
                      <h4 className="db-deadline-title" title={`${task.studentName} — ${task.assignmentTitle}`}>
                        {task.studentName} — {task.assignmentTitle}
                      </h4>
                      <div className="db-deadline-due-badge">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Submitted {task.submittedAt || "recently"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="db-deadline-chevron">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="db-deadlines-footer">
              <span className="db-deadlines-footer-dot" />
              <span>Direct Evaluation · Syncs with IMD Grading Registry</span>
            </div>
          </div>

          {/* 5. MOTIVATIONAL QUOTE CARD (Exact twin of db-quote-card) */}
          <div className="db-quote-card">
            <svg className="db-quote-leaf-graphic" viewBox="0 0 120 120" fill="none">
              <path
                d="M10 110C35 85 45 40 105 15C105 75 60 85 10 110Z"
                fill="url(#quoteLeafGradCleanTrainer)"
              />
              <defs>
                <linearGradient id="quoteLeafGradCleanTrainer" x1="10" y1="110" x2="105" y2="15" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#86efac" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#22c55e" stopOpacity="0.75" />
                </linearGradient>
              </defs>
            </svg>

            <div className="db-quote-symbol">““</div>
            <h4 className="db-quote-text">
              “The art of teaching is the art of assisting discovery.”
            </h4>
            <p className="db-quote-author">— Mark Van Doren · IMD Faculty Portal</p>
          </div>
        </aside>
      </div>
    </TrainerShell>
  );
}
