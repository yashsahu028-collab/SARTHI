"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerHeader({
  searchQuery = "",
  setSearchQuery = () => {},
  placeholder = "Search courses, trainees, submissions, or assessments...",
}) {
  const router = useRouter();
  const { trainer, courses, trainees, submissions, setActiveModal } = useTrainer();
  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Sync internal query with prop during render (React recommended pattern)
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setInternalQuery(searchQuery);
  }

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setInternalQuery(val);
    setSearchQuery(val);
    setIsSearchOpen(val.trim().length > 0);
  };

  // Search Results
  const searchResults = useMemo(() => {
    const q = (internalQuery || "").trim().toLowerCase();
    if (!q) return { courses: [], trainees: [], submissions: [], total: 0 };

    const matchedCourses = courses.filter((c) =>
      c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );

    const matchedTrainees = trainees.filter((t) =>
      t.name.toLowerCase().includes(q) || t.division.toLowerCase().includes(q)
    );

    const matchedSubmissions = submissions.filter((s) =>
      s.studentName.toLowerCase().includes(q) || s.assignmentTitle.toLowerCase().includes(q)
    );

    return {
      courses: matchedCourses.slice(0, 3),
      trainees: matchedTrainees.slice(0, 3),
      submissions: matchedSubmissions.slice(0, 3),
      total: matchedCourses.length + matchedTrainees.length + matchedSubmissions.length,
    };
  }, [internalQuery, courses, trainees, submissions]);

  const notifications = [
    {
      id: 1,
      title: "New Assignment Submission",
      desc: "Mohit Raj submitted INSAT-3DR Radiance Calibration report.",
      time: "15 mins ago",
      unread: true,
      link: "/trainer/assignments",
    },
    {
      id: 2,
      title: "Urgent Student Doubt Logged",
      desc: "Mohit Raj inquired about non-linear Planck lookup tables.",
      time: "45 mins ago",
      unread: true,
      link: "/trainer/messages",
    },
    {
      id: 3,
      title: "Certificate Approval Request",
      desc: "Priya Sharma completed NWP Modeling prerequisites with 98% score.",
      time: "2 hours ago",
      unread: false,
      link: "/trainer/certificates",
    },
  ];

  return (
    <header className="db-topbar">
      {/* Live Search Input Bar */}
      <div className="db-search-bar-wrap" ref={searchContainerRef}>
        <div className="db-search-bar">
          <svg
            className="db-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            className="db-search-input"
            placeholder={placeholder}
            value={internalQuery}
            onChange={handleQueryChange}
            onFocus={() => {
              if (internalQuery.trim().length > 0) setIsSearchOpen(true);
            }}
          />
          {internalQuery ? (
            <button
              onClick={() => {
                setInternalQuery("");
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
              }}
              title="Clear search"
            >
              ✕
            </button>
          ) : (
            <span className="db-search-shortcut">⌘ K</span>
          )}
        </div>

        {/* Live Search Results Floating Card */}
        {isSearchOpen && (
          <div className="db-search-dropdown">
            {searchResults.total === 0 ? (
              <div className="db-search-empty">
                <p className="db-search-empty-title">No results found for &ldquo;{internalQuery}&rdquo;</p>
                <p className="db-search-empty-sub">
                  Try searching for courses, trainees, or assignments.
                </p>
              </div>
            ) : (
              <div className="db-search-results-list">
                {/* Courses Group */}
                {searchResults.courses.length > 0 && (
                  <div className="db-search-group">
                    <span className="db-search-group-title">Courses</span>
                    {searchResults.courses.map((c) => (
                      <Link
                        key={c.id}
                        href="/trainer/courses"
                        onClick={() => setIsSearchOpen(false)}
                        className="db-search-item"
                      >
                        <span className="db-search-item-title">📚 {c.title}</span>
                        <span className="db-search-item-meta">{c.category} • {c.enrolledCount || 0} trainees</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Trainees Group */}
                {searchResults.trainees.length > 0 && (
                  <div className="db-search-group">
                    <span className="db-search-group-title">Trainees</span>
                    {searchResults.trainees.map((t) => (
                      <Link
                        key={t.id}
                        href="/trainer/students"
                        onClick={() => setIsSearchOpen(false)}
                        className="db-search-item"
                      >
                        <span className="db-search-item-title">👤 {t.name}</span>
                        <span className="db-search-item-meta">{t.division} • {t.progress}% Progress</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Submissions Group */}
                {searchResults.submissions.length > 0 && (
                  <div className="db-search-group">
                    <span className="db-search-group-title">Submissions</span>
                    {searchResults.submissions.map((s) => (
                      <Link
                        key={s.id}
                        href="/trainer/assignments"
                        onClick={() => setIsSearchOpen(false)}
                        className="db-search-item"
                      >
                        <span className="db-search-item-title">📝 {s.studentName}</span>
                        <span className="db-search-item-meta">{s.assignmentTitle} • {s.status}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Topbar Right Actions: Action Button + Notification + Role Switcher + User Profile Chip */}
      <div className="db-topbar-actions">
        {/* Quick Action: Schedule Live */}
        <button
          type="button"
          onClick={() => setActiveModal({ type: "schedule_live", data: null })}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "var(--sarthi-primary)",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: "700",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(5, 150, 105, 0.25)",
            transition: "all 0.2s ease",
          }}
          title="Schedule Live Class"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
          <span>Schedule Live</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            className="db-notification-btn"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="db-notification-dot"></span>
          </button>

          {showNotifications && (
            <div className="db-dropdown-popover" style={{ width: "320px", right: 0 }}>
              <div className="db-dropdown-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Faculty Notifications</span>
                <span style={{ fontSize: "11px", color: "var(--sarthi-primary)", fontWeight: "600", cursor: "pointer" }}>
                  Mark all read
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "6px" }}>
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link}
                    onClick={() => setShowNotifications(false)}
                    style={{
                      textDecoration: "none",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      background: n.unread ? "var(--sarthi-mint-50)" : "transparent",
                      border: n.unread ? "1px solid var(--sarthi-border)" : "1px solid transparent",
                      display: "block",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--sarthi-text-heading)" }}>{n.title}</div>
                    <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted)", marginTop: "2px" }}>{n.desc}</div>
                    <div style={{ fontSize: "10px", color: "var(--sarthi-text-light)", marginTop: "3px" }}>{n.time}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div style={{ position: "relative" }}>
          <div
            className="db-top-user-chip"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <img
              src={trainer.avatar || "/images/student-img-1.jpg"}
              alt={trainer.name}
              className="db-top-user-avatar"
            />
            <span className="db-top-user-name">{trainer.name}</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#64748b" }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {showUserMenu && (
            <div className="db-dropdown-popover" style={{ width: "220px", right: 0 }}>
              <div className="db-dropdown-header">
                <div style={{ fontWeight: "800" }}>{trainer.name}</div>
                <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted)", fontWeight: "400" }}>{trainer.title}</div>
              </div>
              <div className="db-notification-item">
                <Link href="/trainer/settings" onClick={() => setShowUserMenu(false)} style={{ textDecoration: "none", color: "inherit" }}>
                  Faculty Settings
                </Link>
              </div>
              <div className="db-notification-item" style={{ color: "#dc2626" }}>
                <button
                  onClick={() => router.push("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    padding: 0,
                    font: "inherit",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
