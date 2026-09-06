"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { CourseThumbnail } from "@/lib/services/courseVisuals";
import { EmptyState, CardSkeleton } from "@/components/dashboard/StateViews";

export default function MyCoursesPage() {
  const { courses, toggleBookmark, student } = useStudent();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  // Filter courses by tab and search
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Tab filter
      if (activeTab === "In Progress" && (course.progress === 0 || course.progress === 100)) return false;
      if (activeTab === "Completed" && course.progress !== 100) return false;
      if (activeTab === "Saved" && !course.isBookmarked) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = course.title?.toLowerCase().includes(q);
        const matchCat = course.category?.toLowerCase().includes(q);
        const matchInst = course.instructor?.name?.toLowerCase().includes(q);
        return matchTitle || matchCat || matchInst;
      }
      return true;
    });
  }, [courses, activeTab, searchQuery]);

  const stats = {
    enrolled: courses.length,
    active: courses.filter((c) => c.progress > 0 && c.progress < 100).length,
    completed: courses.filter((c) => c.progress === 100).length,
    hours: student.hoursLearned || 14.5,
  };

  return (
    <StudentShell
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search your courses, modules, or instructors..."
    >
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Hierarchy) */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              ACADEMIC REPOSITORY
            </span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            My Courses
          </h1>
          <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted)", margin: 0, maxWidth: "600px" }}>
            Continue your learning journey across your enrolled programs.
          </p>
        </div>

        {/* 4 Compact Summary Cards */}
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
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{stats.enrolled}</span>
                <span className="db-stat-label">Total Enrolled</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{stats.active}</span>
                <span className="db-stat-label">In Progress</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{stats.completed}</span>
                <span className="db-stat-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{stats.hours}h</span>
                <span className="db-stat-label">Time Studied</span>
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
            flexWrap: "wrap",
            gap: "12px",
            borderBottom: "1px solid var(--sarthi-border)",
            paddingBottom: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Apple-style Segmented Buttons */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              background: "#ffffff",
              padding: "4px",
              borderRadius: "var(--sarthi-radius-pill)",
              border: "1px solid var(--sarthi-border)",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            }}
          >
            {["All", "In Progress", "Completed", "Saved"].map((tab) => {
              const isCurrent = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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
                  {tab}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: "12.5px", color: "var(--sarthi-text-muted)", fontWeight: "500" }}>
            Showing <strong style={{ color: "var(--sarthi-text-heading)" }}>{filteredCourses.length}</strong> of {courses.length} programs
          </span>
        </div>

        {/* Courses Grid or Zero State */}
        {filteredCourses.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "22px",
            }}
          >
            {filteredCourses.map((course) => {
              const isDone = course.progress === 100;

              return (
                <div
                  key={course.id}
                  className="db-course-card"
                  style={{
                    background: "var(--sarthi-surface)",
                    borderRadius: "18px",
                    border: "1px solid var(--sarthi-border)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.22s ease",
                  }}
                >
                  {/* Top 16:9 Thumbnail Component */}
                  <div style={{ position: "relative" }}>
                    <CourseThumbnail
                      courseId={course.id}
                      src={course.thumbnail}
                      alt={course.title}
                      badge={course.category}
                    />

                    {/* Bookmark Pin Button */}
                    <button
                      onClick={() => toggleBookmark(course.id)}
                      title={course.isBookmarked ? "Remove from saved" : "Save course"}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(6px)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
                        zIndex: 3,
                        color: course.isBookmarked ? "#d97706" : "#64748b",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill={course.isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Card Body with Clean Apple Hierarchy */}
                  <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", flex: 1, gap: "12px" }}>
                    {/* Course Title */}
                    <h3
                      onClick={() => setSelectedCourseModal(course)}
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "var(--sarthi-text-heading)",
                        lineHeight: 1.35,
                        margin: 0,
                        cursor: "pointer",
                      }}
                    >
                      {course.title}
                    </h3>

                    {/* Instructor Info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={course.instructor?.avatar || "/images/student-img-1.jpg"}
                        alt=""
                        aria-hidden="true"
                        style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontSize: "12px", color: "var(--sarthi-text-muted)", fontWeight: "500" }}>
                        {course.instructor?.name || "IMD Faculty Specialist"}
                      </span>
                    </div>

                    {/* Metadata Line */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--sarthi-text-light)" }}>
                      <span>{course.completedLessons || 0} / {course.totalLessons || 0} lessons</span>
                      <span>•</span>
                      <span>{course.durationHours || 0}h total</span>
                    </div>

                    {/* Progress Bar with Percentage */}
                    <div style={{ marginTop: "auto", paddingTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--sarthi-text-muted)" }}>
                          {isDone ? "Completed" : "Progress"}
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: isDone ? "#059669" : "var(--sarthi-text-heading)" }}>
                          {course.progress || 0}%
                        </span>
                      </div>
                      <div style={{ height: "5px", background: "#f0fdf4", borderRadius: "999px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${course.progress || 0}%`,
                            background: isDone ? "#059669" : "var(--sarthi-emerald)",
                            borderRadius: "999px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Primary Action Button */}
                    <button
                      onClick={() => setSelectedCourseModal(course)}
                      style={{
                        width: "100%",
                        padding: "9px 16px",
                        borderRadius: "var(--sarthi-radius-pill)",
                        border: "none",
                        background: isDone ? "#f0fdf4" : "var(--sarthi-pine-deep)",
                        color: isDone ? "#065f46" : "#ffffff",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.18s ease",
                        boxShadow: isDone ? "none" : "0 2px 8px rgba(10, 56, 45, 0.15)",
                        marginTop: "4px",
                      }}
                    >
                      {isDone ? "Review Course" : "Resume Course →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title={activeTab === "Saved" ? "No Saved Courses" : "No Courses Found"}
            description={
              activeTab === "Saved"
                ? "You haven't bookmarked any courses yet. Pin your favorite courses for quick access."
                : "There are no courses matching your current filter. Explore available learning programs."
            }
            actionLabel="Explore All Courses"
            onAction={() => {
              setActiveTab("All");
              setSearchQuery("");
            }}
          />
        )}

        {/* Interactive Course Curriculum Modal */}
        {selectedCourseModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(10, 56, 45, 0.65)",
              backdropFilter: "blur(6px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "760px",
                maxHeight: "88vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Modal Top */}
              <div
                style={{
                  padding: "22px 28px",
                  borderBottom: "1px solid var(--sarthi-border)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  background: "#fcfdfc",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {selectedCourseModal.category}
                  </span>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "4px 0 6px 0" }}>
                    {selectedCourseModal.title}
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--sarthi-text-muted)", margin: 0 }}>
                    Instructor: {selectedCourseModal.instructor?.name} • {selectedCourseModal.durationHours} Hours Total
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCourseModal(null)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body: Syllabus */}
              <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
                <p style={{ fontSize: "13.5px", color: "var(--sarthi-text-body)", lineHeight: 1.6, margin: 0 }}>
                  {selectedCourseModal.description || "Comprehensive scientific curriculum tailored for IMD operational and scientific staff."}
                </p>

                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--sarthi-text-heading)", marginBottom: "12px" }}>
                    Course Modules & Practical Labs
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { title: "Module 1: Mathematical Foundations & Physical Principles", duration: "3h 45m", done: true },
                      { title: "Module 2: Observational Telemetry & Sensor Calibration", duration: "4h 15m", done: true },
                      { title: "Module 3: Operational Analysis & Convective Storm Signatures", duration: "5h 20m", done: selectedCourseModal.progress > 40 },
                      { title: "Module 4: Supercomputing Simulation & Ensemble Verification", duration: "4h 40m", done: selectedCourseModal.progress === 100 },
                    ].map((mod, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          background: mod.done ? "#f0fdf4" : "#fafafa",
                          border: mod.done ? "1px solid #dcfce7" : "1px solid #f1f5f9",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              background: mod.done ? "#10b981" : "#e2e8f0",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "700",
                            }}
                          >
                            {mod.done ? "✓" : idx + 1}
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: mod.done ? "#064e3b" : "var(--sarthi-text-body)" }}>
                            {mod.title}
                          </span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>{mod.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "16px 28px",
                  borderTop: "1px solid var(--sarthi-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#fcfdfc",
                }}
              >
                <span style={{ fontSize: "13px", color: "var(--sarthi-text-muted)" }}>
                  Current Completion: <strong style={{ color: "var(--sarthi-text-heading)" }}>{selectedCourseModal.progress}%</strong>
                </span>
                <button
                  onClick={() => setSelectedCourseModal(null)}
                  style={{
                    background: "var(--sarthi-pine-deep)",
                    color: "#ffffff",
                    padding: "9px 24px",
                    borderRadius: "var(--sarthi-radius-pill)",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Continue Lesson →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
