"use client";

import React, { useState } from "react";
import Link from "next/link";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { courses, toggleCourseStatus, setActiveModal } = useTrainer();

  const categories = ["All", "Remote Sensing", "Modeling", "Radar Meteorology", "Climatology"];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalTrainees = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const activeCount = courses.filter((c) => c.status === "active").length;

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search courses, modules, or curriculum...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                FACULTY CURRICULUM REPOSITORY
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Course Management & Curriculum
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Author, structure meteorological syllabus modules, review batch progression, and schedule live sessions.
            </p>
          </div>

          <button
            type="button"
            className="db-btn-primary"
            onClick={() => setActiveModal({ type: "new_course", data: null })}
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: "#ffffff",
              border: "none",
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
            <span>Create New Course</span>
          </button>
        </div>

        {/* 4 Compact Stat Cards (Identical to Dashboard & Student Courses) */}
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
                <span className="db-stat-value">{courses.length}</span>
                <span className="db-stat-label">Assigned Courses</span>
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
                <span className="db-stat-value">{totalTrainees}</span>
                <span className="db-stat-label">Total Trainees</span>
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
                <span className="db-stat-value">{activeCount}</span>
                <span className="db-stat-label">Active Batches</span>
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
                <span className="db-stat-value">91%</span>
                <span className="db-stat-label">Avg Pass Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs (Clean Rounded Pills) */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "700",
                border: selectedCategory === cat ? "1px solid var(--sarthi-primary, #024a3a)" : "1px solid var(--sarthi-border, #e2e8f0)",
                background: selectedCategory === cat ? "var(--sarthi-primary, #024a3a)" : "#ffffff",
                color: selectedCategory === cat ? "#ffffff" : "var(--sarthi-text-body, #334155)",
                cursor: "pointer",
                transition: "all 0.18s ease",
                boxShadow: selectedCategory === cat ? "0 2px 6px rgba(2,74,58,0.2)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="trainer-courses-grid" style={{ marginBottom: "36px" }}>
          {filteredCourses.map((course) => (
            <div key={course.id} className="trainer-course-card">
              <div className="trainer-course-thumb-wrap">
                <img src={course.thumbnail} alt={course.title} className="trainer-course-thumb" />
                <button
                  type="button"
                  onClick={() => toggleCourseStatus(course.id)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    fontSize: "10.5px",
                    fontWeight: "800",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    border: "none",
                    cursor: "pointer",
                    background: course.status === "active" ? "#059669" : "#64748b",
                    color: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                  title="Click to toggle publish status"
                >
                  ● {course.status}
                </button>
              </div>

              <div className="trainer-course-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span className="trainer-course-cat" style={{ color: "#059669" }}>{course.category}</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>{course.level}</span>
                </div>

                <h3 className="trainer-course-title">{course.title}</h3>
                <p style={{ fontSize: "12.5px", color: "var(--sarthi-text-muted, #64748b)", margin: "0 0 12px 0", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {course.description}
                </p>

                <div className="trainer-course-stats-bar">
                  <span>👥 {course.enrolledCount} Trainees</span>
                  <span>📖 {course.totalModules || course.modules?.length || 4} Modules</span>
                  <span>⏱️ {course.durationHours}h</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px", color: "var(--sarthi-text-muted, #64748b)", fontWeight: "600" }}>
                  <span>Batch Progress</span>
                  <span style={{ color: "#059669", fontWeight: "700" }}>{course.completionRate}%</span>
                </div>
                <div className="trainer-progress-bar-wrap">
                  <div className="trainer-progress-bar-fill" style={{ width: `${course.completionRate}%`, background: "#059669" }}></div>
                </div>

                <div className="trainer-course-footer" style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="trainer-quick-btn trainer-btn-outline"
                    style={{ flex: 1, justifyContent: "center", height: "36px", fontSize: "12.5px", fontWeight: "700", borderRadius: "8px" }}
                    onClick={() => setSelectedCourse(course)}
                  >
                    Inspect Syllabus ({course.modules?.length || 0})
                  </button>
                  <button
                    type="button"
                    className="trainer-quick-btn trainer-btn-green"
                    style={{ height: "36px", padding: "0 14px", fontSize: "12.5px", fontWeight: "700", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    onClick={() => setActiveModal({ type: "schedule_live", data: course })}
                    title="Schedule Live Class"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <span>Live</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Course Syllabus Inspector Drawer / Modal */}
        {selectedCourse && (
          <div className="trainer-modal-overlay" onClick={() => setSelectedCourse(null)}>
            <div className="trainer-modal-card" style={{ maxWidth: "720px" }} onClick={(e) => e.stopPropagation()}>
              <div className="trainer-modal-header">
                <div>
                  <h3 className="trainer-modal-title">{selectedCourse.title}</h3>
                  <div style={{ fontSize: "12.5px", color: "var(--sarthi-text-muted, #64748b)", marginTop: "2px" }}>
                    Syllabus Structure & Module Contents &bull; {selectedCourse.enrolledCount} Trainees Enrolled
                  </div>
                </div>
                <button className="trainer-modal-close" onClick={() => setSelectedCourse(null)}>&times;</button>
              </div>

              <div className="trainer-modal-body">
                <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                  {selectedCourse.description}
                </p>

                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", marginBottom: "12px" }}>
                    Modules & Scientific Lessons
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {selectedCourse.modules?.map((mod, mIdx) => (
                      <div key={mod.id || mIdx} style={{ background: "var(--sarthi-surface-subtle, #f8faf9)", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "12px", padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--sarthi-text-heading, #0a2920)" }}>
                            {mod.title}
                          </span>
                          <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#059669" }}>
                            {mod.duration}
                          </span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "4px" }}>
                          {mod.lessons?.map((les, lIdx) => (
                            <div key={les.id || lIdx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12.5px", color: "#334155", padding: "4px 0" }}>
                              <span>{les.title}</span>
                              <span style={{ fontSize: "11px", background: "#ffffff", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--sarthi-border, #e2e8f0)", color: "#64748b" }}>
                                {les.type.toUpperCase()} &bull; {les.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="trainer-modal-footer">
                <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={() => setSelectedCourse(null)}>
                  Close
                </button>
                <button
                  type="button"
                  className="db-btn-primary"
                  style={{ borderRadius: "8px", padding: "8px 18px", fontSize: "13px" }}
                  onClick={() => {
                    setActiveModal({ type: "new_assignment", data: selectedCourse });
                    setSelectedCourse(null);
                  }}
                >
                  + Add Module Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TrainerShell>
  );
}
