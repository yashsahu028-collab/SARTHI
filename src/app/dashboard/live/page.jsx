"use client";

import React, { useState } from "react";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { EmptyState } from "@/components/dashboard/StateViews";

export default function LiveClassesPage() {
  const { liveClasses, setActiveLiveModal } = useStudent();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Determine Next Class (live or nearest upcoming)
  const nextClass = liveClasses.find((c) => c.status === "live") || liveClasses.find((c) => c.status === "upcoming") || liveClasses[0];

  const upcomingClasses = liveClasses.filter((c) => c.status === "upcoming" || c.status === "live");
  const pastClasses = liveClasses.filter((c) => c.status === "completed");

  const displayedList = activeTab === "upcoming" ? upcomingClasses : pastClasses;

  return (
    <StudentShell placeholder="Search live lectures, instructors, or topics...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Hierarchy) */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              SYNAPTIC TIMELINE
            </span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Live Classes
          </h1>
          <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted)", margin: 0 }}>
            Join live synchronous operational workshops, radar velocity clinics, and remote sensing sessions with IMD senior scientists.
          </p>
        </div>

        {/* Featured Next Class Card */}
        {nextClass && (
          <div
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%, #e6f9ed 100%)",
              border: "1px solid #c9edd7",
              borderRadius: "20px",
              padding: "26px 32px",
              boxShadow: "0 4px 18px rgba(16, 185, 129, 0.08)",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div style={{ flex: "1 1 420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span
                  style={{
                    background: nextClass.status === "live" ? "#ef4444" : "#065f46",
                    color: "#ffffff",
                    fontSize: "10.5px",
                    fontWeight: "800",
                    padding: "3px 9px",
                    borderRadius: "6px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {nextClass.status === "live" && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffffff" }} />}
                  {nextClass.status === "live" ? "Live Right Now" : "Featured Next Class"}
                </span>
                <span style={{ fontSize: "12px", color: "var(--sarthi-text-muted)", fontWeight: "600" }}>
                  {nextClass.course}
                </span>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: "0 0 8px 0" }}>
                {nextClass.topic}
              </h2>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "var(--sarthi-text-body)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{nextClass.date} • {nextClass.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{nextClass.instructor}</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => setActiveLiveModal(nextClass)}
                style={{
                  background: "var(--sarthi-pine-deep)",
                  color: "#ffffff",
                  padding: "12px 28px",
                  borderRadius: "var(--sarthi-radius-pill)",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(10, 56, 45, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Join Classroom
              </button>
            </div>
          </div>
        )}

        {/* Segmented Filter Control */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--sarthi-border)",
            paddingBottom: "14px",
            marginBottom: "20px",
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
            <button
              onClick={() => setActiveTab("upcoming")}
              style={{
                padding: "6px 18px",
                borderRadius: "var(--sarthi-radius-pill)",
                border: "none",
                background: activeTab === "upcoming" ? "var(--sarthi-pine-deep)" : "transparent",
                color: activeTab === "upcoming" ? "#ffffff" : "var(--sarthi-text-muted)",
                fontWeight: activeTab === "upcoming" ? "700" : "600",
                fontSize: "12.5px",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              Upcoming ({upcomingClasses.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              style={{
                padding: "6px 18px",
                borderRadius: "var(--sarthi-radius-pill)",
                border: "none",
                background: activeTab === "past" ? "var(--sarthi-pine-deep)" : "transparent",
                color: activeTab === "past" ? "#ffffff" : "var(--sarthi-text-muted)",
                fontWeight: activeTab === "past" ? "700" : "600",
                fontSize: "12.5px",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              Past Sessions ({pastClasses.length})
            </button>
          </div>

          <span style={{ fontSize: "12.5px", color: "var(--sarthi-text-muted)" }}>
            Attendance Rate: <strong style={{ color: "var(--sarthi-text-heading)" }}>94%</strong>
          </span>
        </div>

        {/* Classes List */}
        {displayedList.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {displayedList.map((item) => {
              const isLive = item.status === "live";
              const isPast = item.status === "completed";

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--sarthi-border)",
                    borderRadius: "16px",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Date badge */}
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "12px",
                        background: isLive ? "#fee2e2" : "#f0fdf4",
                        border: isLive ? "1px solid #fca5a5" : "1px solid #dcfce7",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: "800", color: isLive ? "#b91c1c" : "#15803d", textTransform: "uppercase" }}>
                        MAR
                      </span>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: isLive ? "#991b1b" : "#064e3b" }}>
                        {item.date?.split(" ")[1] || "10"}
                      </span>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#065f46" }}>
                          {item.course}
                        </span>
                        {isLive && (
                          <span style={{ background: "#ef4444", color: "#ffffff", fontSize: "9px", fontWeight: "800", padding: "1px 6px", borderRadius: "4px" }}>
                            LIVE NOW
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--sarthi-text-heading)", margin: 0 }}>
                        {item.topic}
                      </h4>
                      <div style={{ fontSize: "12px", color: "var(--sarthi-text-muted)", marginTop: "3px" }}>
                        {item.time} • Instructor: {item.instructor}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isPast ? (
                      <button
                        onClick={() => setActiveLiveModal(item)}
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          color: "#475569",
                          padding: "8px 18px",
                          borderRadius: "var(--sarthi-radius-pill)",
                          fontSize: "12.5px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Watch Recording
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveLiveModal(item)}
                        style={{
                          background: isLive ? "#ef4444" : "var(--sarthi-pine-deep)",
                          color: "#ffffff",
                          padding: "8px 20px",
                          borderRadius: "var(--sarthi-radius-pill)",
                          border: "none",
                          fontSize: "12.5px",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {isLive ? "Join Live Now" : "Enter Room"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="You're All Caught Up"
            description="There are no upcoming live classes right now. Check back soon for scheduled operational sessions."
            actionLabel="Explore Course Materials"
            actionHref="/dashboard/courses"
          />
        )}
      </div>
    </StudentShell>
  );
}
