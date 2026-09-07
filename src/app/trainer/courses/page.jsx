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

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search courses or modules...">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Course Management & Curriculum Builder
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Author, structure syllabus modules, attach NetCDF datasets, and manage trainee enrollments.
          </p>
        </div>

        <button
          type="button"
          className="trainer-quick-btn trainer-btn-green"
          onClick={() => setActiveModal({ type: "new_course", data: null })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Create New Course</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "700",
              border: selectedCategory === cat ? "1px solid var(--tr-accent-teal)" : "1px solid var(--tr-border)",
              background: selectedCategory === cat ? "#024a3a" : "#ffffff",
              color: selectedCategory === cat ? "#ffffff" : "var(--tr-text-body)",
              cursor: "pointer",
              transition: "all 0.2s ease",
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
                className={`trainer-course-status-pill ${course.status === "active" ? "pill-active" : "pill-draft"}`}
                style={{ border: "none", cursor: "pointer" }}
                title="Click to toggle publish status"
              >
                {course.status} (Toggle)
              </button>
            </div>

            <div className="trainer-course-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="trainer-course-cat">{course.category}</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>{course.level}</span>
              </div>

              <h3 className="trainer-course-title">{course.title}</h3>
              <p style={{ fontSize: "12.5px", color: "var(--tr-text-muted)", margin: "0 0 12px 0", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {course.description}
              </p>

              <div className="trainer-course-stats-bar">
                <span>👥 {course.enrolledCount} Trainees</span>
                <span>📖 {course.totalModules || course.modules?.length || 4} Modules</span>
                <span>⏱️ {course.durationHours}h</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px", color: "var(--tr-text-muted)", fontWeight: "600" }}>
                <span>Batch Progress</span>
                <span style={{ color: "#059669", fontWeight: "700" }}>{course.completionRate}%</span>
              </div>
              <div className="trainer-progress-bar-wrap">
                <div className="trainer-progress-bar-fill" style={{ width: `${course.completionRate}%` }}></div>
              </div>

              <div className="trainer-course-footer">
                <button
                  type="button"
                  className="trainer-quick-btn trainer-btn-outline"
                  style={{ flex: 1, justifyContent: "center", height: "34px", fontSize: "12.5px" }}
                  onClick={() => setSelectedCourse(course)}
                >
                  Inspect Syllabus ({course.modules?.length || 0})
                </button>
                <button
                  type="button"
                  className="trainer-quick-btn trainer-btn-green"
                  style={{ height: "34px", padding: "0 12px", fontSize: "12.5px" }}
                  onClick={() => setActiveModal({ type: "schedule_live", data: course })}
                  title="Schedule Live Class"
                >
                  🎥
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
                <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)", marginTop: "2px" }}>
                  Syllabus Structure & Module Contents &bull; {selectedCourse.enrolledCount} Trainees Enrolled
                </div>
              </div>
              <button className="trainer-modal-close" onClick={() => setSelectedCourse(null)}>&times;</button>
            </div>

            <div className="trainer-modal-body">
              <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                {selectedCourse.description}
              </p>

              <div style={{ marginTop: "12px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: "800", color: "var(--tr-text-heading)", marginBottom: "12px" }}>
                  Modules & Scientific Lessons
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedCourse.modules?.map((mod, mIdx) => (
                    <div key={mod.id || mIdx} style={{ background: "var(--tr-surface-alt)", border: "1px solid var(--tr-border)", borderRadius: "var(--tr-radius-md)", padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--tr-text-heading)" }}>
                          {mod.title}
                        </span>
                        <span style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--tr-accent-teal)" }}>
                          {mod.duration}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "8px" }}>
                        {mod.lessons?.map((les, lIdx) => (
                          <div key={les.id || lIdx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12.5px", color: "var(--tr-text-body)", padding: "4px 0" }}>
                            <span>{les.title}</span>
                            <span style={{ fontSize: "11px", background: "#ffffff", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--tr-border)", color: "#64748b" }}>
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
                className="trainer-quick-btn trainer-btn-green"
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
    </TrainerShell>
  );
}
