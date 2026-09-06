"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { FloatMotion } from "@/components/motion/MotionWrapper";
import { CourseThumbnail } from "@/lib/services/courseVisuals";
import { EmptyState } from "@/components/dashboard/StateViews";
import "./dashboard.css";

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

function formatDueDate(dateStr) {
  if (!dateStr) return "Due in 2 days";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return `Due: ${dateStr}`;
    return `Due: ${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  } catch {
    return `Due: ${dateStr}`;
  }
}

function DashboardContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { student, courses, liveClasses, assignments, conversations, setActiveLiveModal } = useStudent();

  // Pending assignments for deadlines widget
  const pendingAssignments = useMemo(() => {
    return (assignments || []).filter((a) => a.status === "pending").slice(0, 2);
  }, [assignments]);


  // Weekly study distribution
  const weeklyStudyHours = [
    { day: "M", hours: 2.5, max: 4 },
    { day: "T", hours: 3.2, max: 4 },
    { day: "W", hours: 1.8, max: 4 },
    { day: "T", hours: 3.8, max: 4 },
    { day: "F", hours: 2.2, max: 4 },
    { day: "S", hours: 1.0, max: 4 },
    { day: "S", hours: 0.5, max: 4 },
  ];

  // Primary in-progress course
  const activeCourse = courses.find((c) => c.status === "active") || courses[0] || {
    id: "satellite-meteorology",
    title: "Satellite Meteorology & Remote Sensing",
    instructor: { name: "Dr. R. K. Sharma (Scientist-F, IMD)" },
    progress: 65,
    nextLesson: "3. INSAT-3D & 3DR Radiance Analysis",
  };

  // Competency Progress Data (NO EMOJIS, real SVGs)
  const competencies = [
    { id: 1, name: "Satellite Meteorology", pct: 90, iconType: "satellite" },
    { id: 2, name: "Radar & Doppler Dynamics", pct: 78, iconType: "radar" },
    { id: 3, name: "NWP Numerical Modeling", pct: 95, iconType: "nwp" },
    { id: 4, name: "Synoptic Monsoon Dynamics", pct: 80, iconType: "monsoon" },
    { id: 5, name: "Disaster Early Warning & Agromet", pct: 85, iconType: "disaster" },
  ];

  // Real IMD Recommended Courses derived dynamically from student catalog
  const recommendedCourses = useMemo(() => {
    return courses
      .filter((c) => c.id !== activeCourse?.id)
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        title: c.title,
        instructor: c.instructor?.name || "IMD Faculty",
        lessons: `${c.totalLessons} Lessons`,
        duration: `${c.durationHours}h`,
        category: c.category,
        thumbnail: c.thumbnail,
        link: "/dashboard/courses",
      }));
  }, [courses, activeCourse]);

  // Recent Activities
  const recentActivities = [
    {
      id: "act-1",
      type: "green",
      title: "Completed: Satellite Data Basics Quiz",
      time: "2 hours ago",
    },
    {
      id: "act-2",
      type: "blue",
      title: "Submitted: NWP Numerical Assignment 2",
      time: "5 hours ago",
    },
    {
      id: "act-3",
      type: "purple",
      title: "Attended: Doppler Radar Live Class",
      time: "1 day ago",
    },
    {
      id: "act-4",
      type: "gold",
      title: "Earned: IMD Trainee Meteorologist Badge",
      time: "2 days ago",
    },
  ];

  // Search filter
  const filteredRecommendations = useMemo(() => {
    if (!searchQuery.trim()) return recommendedCourses;
    return recommendedCourses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <StudentShell searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* ----------------------------------------------------------------
          DASHBOARD 2-COLUMN GRID (Main Column + Utility Column)
          ---------------------------------------------------------------- */}
      <div className="db-grid-layout">
        {/* ==============================================================
            CENTER COLUMN
            ============================================================== */}
        <div className="db-center-column">
          {/* 1. WELCOME HERO */}
          <section className="db-hero-card">
            <div className="db-hero-wave-bg"></div>

            <div className="db-hero-left">
              <p className="db-hero-greeting">Welcome back,</p>
              <h1 className="db-hero-name">
                {student.name} <span className="db-hero-wave-emoji">👋</span>
              </h1>
              <p className="db-hero-tagline">“Learn today. Lead tomorrow.”</p>
              <Link href="/dashboard/courses" className="db-hero-action-btn">
                Continue Learning →
              </Link>
            </div>

            {/* Mascot Center Area */}
            <div className="db-hero-mascot-area">
              <span className="db-mascot-label">Your Learning Sarthi!</span>
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
                <span>Learn</span>
              </div>
              <div className="db-pillar-item">
                <svg className="db-pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                <span>Practice</span>
              </div>
              <div className="db-pillar-item">
                <svg className="db-pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Grow</span>
              </div>
              <div className="db-pillar-item">
                <svg className="db-pillar-icon" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>Achieve</span>
              </div>
            </div>
          </section>

          {/* 2. STATS ROW (4 CARDS) */}
          <section className="db-stats-row">
            {/* Card 1: Enrolled Courses */}
            <div className="db-stat-card" onClick={() => router.push("/dashboard/courses")}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box green">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{student.enrolledCoursesCount}</span>
                  <span className="db-stat-label">Enrolled Courses</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Card 2: Hours Learned */}
            <div className="db-stat-card" onClick={() => router.push("/dashboard/progress")}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box purple">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{student.hoursLearned}</span>
                  <span className="db-stat-label">Hours Learned</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Card 3: Assignments Done */}
            <div className="db-stat-card" onClick={() => router.push("/dashboard/assignments")}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box green">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{student.assignmentsDone}</span>
                  <span className="db-stat-label">Assignments Done</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {/* Card 4: Overall Progress */}
            <div className="db-stat-card" onClick={() => router.push("/dashboard/progress")}>
              <div className="db-stat-left">
                <div className="db-stat-icon-box gold">
                  <svg className="db-stat-icon" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="db-stat-data">
                  <span className="db-stat-value">{student.overallProgress}%</span>
                  <span className="db-stat-label">Overall Progress</span>
                </div>
              </div>
              <svg className="db-stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </section>

          {/* 3. CONTINUE LEARNING SECTION */}
          <section className="db-continue-learning-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Continue Learning</h3>
              <Link href="/dashboard/courses" className="db-view-all-link">
                View all →
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
                <div className="db-thumbnail-badge">IN PROGRESS</div>
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
                  By {activeCourse.instructor?.name || "Dr. R. K. Sharma (Scientist-F, IMD)"} • Next lesson: {activeCourse.nextLesson}
                </p>

                <div className="db-progress-bar-wrap">
                  <div className="db-progress-track">
                    <div
                      className="db-progress-fill"
                      style={{ width: `${activeCourse.progress}%` }}
                    ></div>
                  </div>
                  <span className="db-progress-percent">{activeCourse.progress}%</span>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <Link href="/dashboard/courses" className="db-continue-btn">
                    <svg className="db-play-triangle" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span>Continue Learning</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. YOUR PROGRESS SECTION */}
          <section className="db-progress-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Your Progress</h3>
              <Link href="/dashboard/progress" className="db-view-all-link">
                View details →
              </Link>
            </div>

            {competencies.length === 0 ? (
              <EmptyState
                title="Your learning progress will appear here as you complete courses."
                description="Begin your enrolled modules to start recording competency progress."
                actionLabel="Resume Learning"
                actionHref="/dashboard/courses"
              />
            ) : (
              <div className="db-progress-card">
                <div className="db-progress-main-row">
                  {/* Left: Circular Donut Gauge */}
                  <div className="db-donut-chart-container">
                    <svg className="db-donut-svg" viewBox="0 0 140 140" aria-label={`Overall progress ${student.overallProgress || 92}%`}>
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
                        strokeDashoffset={339.29 - (339.29 * (student.overallProgress || 92)) / 100}
                      />
                    </svg>
                    <div className="db-donut-center-text">
                      <span className="db-donut-percent">{student.overallProgress || 92}%</span>
                      <span className="db-donut-label">Completed</span>
                    </div>
                  </div>

                  {/* Right: Progress List Rows */}
                  <div className="db-competency-list">
                    {competencies.map((comp) => (
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
                      <h5 className="db-cert-title">Complete 2 more modules to earn</h5>
                      <p className="db-cert-subtitle">IMD Senior Remote Sensing Specialist Certification</p>
                    </div>
                  </div>
                  <Link href="/dashboard/certificates" className="db-cert-claim-btn">
                    View Wallet →
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* 5. RECOMMENDED FOR YOU (REAL IMD COURSES) */}
          <section className="db-recommended-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Recommended IMD Courses</h3>
              <Link href="/dashboard/courses" className="db-view-all-link">
                View catalog ({courses.length}) →
              </Link>
            </div>

            {filteredRecommendations.length > 0 ? (
              <div className="db-recommended-grid">
                {filteredRecommendations.map((course) => (
                  <Link key={course.id} href="/dashboard/courses" className="db-rec-card-apple">
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
                        <span className="db-rec-instructor-name">{course.instructor}</span>
                        <span className="db-rec-dot">·</span>
                        <span className="db-rec-lesson-count">{course.lessons}</span>
                      </div>
                      <div className="db-rec-action-link">
                        <span>View course</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recommendations right now"
                description={`No courses matched "${searchQuery}". Explore the IMD catalog to discover more learning programs.`}
                actionLabel="Browse Courses →"
                actionHref="/dashboard/courses"
              />
            )}
          </section>
        </div>

        {/* ==============================================================
            RIGHT UTILITY COLUMN
            ============================================================== */}
        <aside className="db-right-column">
          {/* 1. UPCOMING CLASSES */}
          <div className="db-upcoming-card">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ fontSize: "16px" }}>
                Upcoming Classes
              </h3>
              <Link href="/dashboard/live" className="db-view-all-link">
                View all →
              </Link>
            </div>

            <div className="db-upcoming-list">
              {liveClasses.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.status === "live") {
                      setActiveLiveModal(item);
                    } else {
                      router.push("/dashboard/live");
                    }
                  }}
                  className="db-upcoming-item"
                  style={{ cursor: "pointer" }}
                >
                  <div className="db-upcoming-left">
                    <div className="db-calendar-badge">
                      <span className="db-cal-day">{item.day}</span>
                      <span className="db-cal-month">{item.month}</span>
                    </div>
                    <div className="db-upcoming-info">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <h4 className="db-upcoming-title">{item.title}</h4>
                        {item.status === "live" && (
                          <span style={{ background: "#ef4444", color: "#fff", fontSize: "8px", fontWeight: "800", padding: "1px 5px", borderRadius: "4px" }}>
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="db-upcoming-time">{item.time}</p>
                      <p className="db-upcoming-author">By {item.instructor}</p>
                    </div>
                  </div>
                  <svg className="db-upcoming-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* 2. RECENT ACTIVITY */}
          <div className="db-activity-card">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ fontSize: "16px" }}>
                Recent Activity
              </h3>
              <Link href="/dashboard/progress" className="db-view-all-link">
                View all →
              </Link>
            </div>

            <div className="db-activity-list">
              {recentActivities.map((act) => (
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

          {/* 3. WEEKLY STUDY TARGET CARD */}
          <div className="db-target-card">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ fontSize: "16px", fontWeight: "700" }}>
                Study Goal Target
              </h3>
              <span className="db-target-pct-badge">72% Met</span>
            </div>

            <div className="db-target-stats">
              <span className="db-target-value">
                {student.hoursLearned || 14.5} <span className="db-target-subtext">/ 20 hrs</span>
              </span>
              <span className="db-target-goal">5.5 hrs to goal</span>
            </div>

            <div className="db-target-bar-wrap">
              <div className="db-target-bar-fill" style={{ width: "72%" }} />
            </div>

            <div className="db-target-histogram-header">
              <span className="db-target-hist-title">Daily Study Breakdown</span>
              <span className="db-target-hist-target">Target: 3.0h / day</span>
            </div>

            {/* 7-Day Mini Histogram */}
            <div className="db-target-days-grid">
              {weeklyStudyHours.map((d, i) => (
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
              <span>Avg. 2.1h / day · On track for 20h certification target</span>
            </div>
          </div>

          {/* 4. PENDING DEADLINES & LAB TASKS */}
          {pendingAssignments.length > 0 && (
            <div className="db-deadlines-card">
              <div className="db-section-header">
                <h3 className="db-section-title" style={{ fontSize: "16px", fontWeight: "700" }}>
                  Pending Deadlines
                </h3>
                <Link href="/dashboard/assignments" className="db-view-all-link">
                  View all ({assignments.filter((a) => a.status === "pending").length}) →
                </Link>
              </div>

              <div className="db-deadlines-list">
                {pendingAssignments.map((task) => (
                  <Link key={task.id} href="/dashboard/assignments" className="db-deadline-item">
                    <div className="db-deadline-left">
                      <div className="db-deadline-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="db-deadline-content">
                        <h4 className="db-deadline-title" title={task.title}>{task.title}</h4>
                        <div className="db-deadline-due-badge">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>{formatDueDate(task.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="db-deadline-chevron">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="db-deadlines-footer">
                <span className="db-deadlines-footer-dot" />
                <span>Syncs with IMD Examination Portal</span>
              </div>
            </div>
          )}


          {/* 6. MOTIVATIONAL QUOTE CARD */}
          <div className="db-quote-card">
            <svg className="db-quote-leaf-graphic" viewBox="0 0 120 120" fill="none">
              <path
                d="M10 110C35 85 45 40 105 15C105 75 60 85 10 110Z"
                fill="url(#quoteLeafGradClean)"
              />
              <defs>
                <linearGradient id="quoteLeafGradClean" x1="10" y1="110" x2="105" y2="15" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#86efac" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#22c55e" stopOpacity="0.75" />
                </linearGradient>
              </defs>
            </svg>

            <div className="db-quote-symbol">““</div>
            <h4 className="db-quote-text">
              “A better you builds a brighter India.”
            </h4>
            <p className="db-quote-author">— Sarthi</p>
          </div>
        </aside>
      </div>
    </StudentShell>
  );
}

export default function StudentDashboardPage() {
  return <DashboardContent />;
}
