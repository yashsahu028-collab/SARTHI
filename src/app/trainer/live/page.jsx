"use client";

import React, { useState } from "react";
import Link from "next/link";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerLiveStudioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [activeTab, setActiveTab] = useState("attendees"); // 'attendees' | 'poll'
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("Which channel best isolates low-level sea fog during nighttime over the Arabian Sea?");
  const [pollOptions, setPollOptions] = useState([
    { text: "TIR1 (10.8 µm) - TIR2 (12.0 µm)", votes: 24, pct: 45 },
    { text: "MIR (3.9 µm) - TIR1 (10.8 µm) Fog Mask", votes: 28, pct: 52 },
    { text: "WV (6.7 µm) Upper Channel", votes: 2, pct: 3 },
  ]);

  const { liveClasses, setActiveModal } = useTrainer();

  const connectedAttendees = [
    { id: "std-1", name: "Mohit Raj", division: "NWP Division", mic: false, handRaised: true, avatar: "/images/student-img-1.jpg" },
    { id: "std-2", name: "Priya Sharma", division: "Satellite Div.", mic: false, handRaised: false, avatar: "/images/student-img-2.jpg" },
    { id: "std-3", name: "Rahul Verma", division: "Radar Div.", mic: false, handRaised: false, avatar: "/images/student-img-3.jpg" },
    { id: "std-5", name: "Vikram Malhotra", division: "Cyclone Warning", mic: true, handRaised: false, avatar: "/images/student-img-1.jpg" },
    { id: "std-7", name: "Sneha Mukherjee", division: "Monsoon Center", mic: false, handRaised: true, avatar: "/images/student-img-2.jpg" },
  ];

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search live sessions, recordings, or agendas...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                SYNCHRONOUS MASTERCLASS STUDIO
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Live Studio & Masterclass
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Broadcast meteorological masterclasses, conduct interactive polls, and monitor real-time trainee engagement.
            </p>
          </div>

          <button
            type="button"
            className="db-btn-primary"
            onClick={() => setActiveModal({ type: "schedule_live", data: null })}
            style={{
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
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <span>Schedule New Session</span>
          </button>
        </div>

        {/* 4 Top KPI Stat Cards */}
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
              <div className="db-stat-icon-box" style={{ background: "#fee2e2", color: "#dc2626" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#dc2626" }}></span>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value" style={{ color: "#dc2626" }}>ON-AIR</span>
                <span className="db-stat-label">Studio State</span>
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
                <span className="db-stat-value">48</span>
                <span className="db-stat-label">Connected Trainees</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{liveClasses.length}</span>
                <span className="db-stat-label">Scheduled Sessions</span>
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
                <span className="db-stat-value">96.4%</span>
                <span className="db-stat-label">Avg Attendance Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE STUDIO STAGE & SIDEBAR */}
        <div className="trainer-studio-container" style={{ marginBottom: "36px" }}>
          {/* Presenter Canvas / Stage */}
          <div className="trainer-stage-screen">
            <div className="trainer-stage-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="trainer-live-indicator">
                  <span className="trainer-live-dot-pulse"></span>
                  {isLiveActive ? "LIVE ON-AIR" : "STUDIO PAUSED"}
                </span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>
                  INSAT-3DR Rapid Scan & Radar Convective Analysis Lab
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: "600" }}>
                48 Trainees Connected &bull; 00:42:15
              </div>
            </div>

            <div className="trainer-stage-canvas">
              {/* Live Radar Feed Simulator */}
              <div className="trainer-radar-mock">
                <div className="trainer-radar-sweep"></div>
                <div style={{ position: "absolute", textAlign: "center", zIndex: 5 }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: "#a7f3d0", letterSpacing: "1px" }}>
                    DWR PALAM (NEW DELHI)
                  </div>
                  <div style={{ fontSize: "11px", color: "#6ee7b7" }}>
                    Reflectivity (dBZ) &bull; Max Z = 52.4 dBZ
                  </div>
                  <div style={{ fontSize: "10px", color: "#cbd5e1", marginTop: "4px" }}>
                    Severe Squall Line Approaching NW Sector
                  </div>
                </div>
              </div>

              {/* Presenter PiP Box */}
              <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "120px", height: "85px", background: "#02231c", border: "2px solid #10b981", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {isCamOn ? (
                  <img src="/images/student-img-1.jpg" alt="Dr. Sharma" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Camera Off</div>
                )}
                <div style={{ position: "absolute", bottom: "2px", left: "4px", fontSize: "9px", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "1px 4px", borderRadius: "3px" }}>
                  Dr. R. K. Sharma
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="trainer-stage-controls">
              <button
                type="button"
                className={`trainer-ctrl-btn ${isMicOn ? "active" : ""}`}
                onClick={() => setIsMicOn(!isMicOn)}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </button>

              <button
                type="button"
                className={`trainer-ctrl-btn ${isCamOn ? "active" : ""}`}
                onClick={() => setIsCamOn(!isCamOn)}
                title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </button>

              <button
                type="button"
                className={`trainer-ctrl-btn ${isSharingScreen ? "active" : ""}`}
                onClick={() => setIsSharingScreen(!isSharingScreen)}
                title="Share Screen"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </button>

              <button
                type="button"
                className="trainer-ctrl-btn"
                onClick={() => setActiveTab("poll")}
                title="Live Poll"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </button>

              <button
                type="button"
                className="trainer-ctrl-btn danger"
                onClick={() => setIsLiveActive(!isLiveActive)}
                title={isLiveActive ? "Pause Session" : "Resume Session"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  {isLiveActive ? (
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  ) : (
                    <polygon points="5 3 19 12 5 21 5 3" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Live Side Panel */}
          <div className="trainer-section-card" style={{ display: "flex", flexDirection: "column", padding: "18px", borderRadius: "18px", background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)" }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", paddingBottom: "10px", marginBottom: "14px", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("attendees")}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  border: "none",
                  background: activeTab === "attendees" ? "var(--sarthi-mint-50, #e8f5ee)" : "transparent",
                  color: activeTab === "attendees" ? "var(--sarthi-primary, #024a3a)" : "var(--sarthi-text-muted, #64748b)",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Trainees (48)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("poll")}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  border: "none",
                  background: activeTab === "poll" ? "var(--sarthi-mint-50, #e8f5ee)" : "transparent",
                  color: activeTab === "poll" ? "var(--sarthi-primary, #024a3a)" : "var(--sarthi-text-muted, #64748b)",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Live Poll
              </button>
            </div>

            {activeTab === "attendees" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--sarthi-text-muted, #64748b)" }}>Raised Hands (2)</span>
                  <span style={{ fontSize: "11px", color: "#059669", cursor: "pointer", fontWeight: "700" }}>Mute All</span>
                </div>

                {connectedAttendees.map((att) => (
                  <div key={att.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: att.handRaised ? "#fef3c7" : "var(--sarthi-surface-subtle, #f8faf9)", borderRadius: "10px", border: att.handRaised ? "1px solid #f59e0b" : "1px solid var(--sarthi-border, #e2e8f0)" }}>
                    <img src={att.avatar} alt={att.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                        {att.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>{att.division}</div>
                    </div>
                    {att.handRaised && <span style={{ fontSize: "12px", fontWeight: "800", color: "#d97706" }}>✋</span>}
                    <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{att.mic ? "Unmuted" : "Muted"}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "poll" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>
                  Active Interactive Poll
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--sarthi-text-body, #334155)", background: "var(--sarthi-surface-subtle, #f8faf9)", padding: "10px 12px", borderRadius: "10px", fontWeight: "600", border: "1px solid var(--sarthi-border, #e2e8f0)" }}>
                  {pollQuestion}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "8px", padding: "8px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                        <span>{opt.text}</span>
                        <span style={{ fontWeight: "700", color: "#059669" }}>{opt.pct}% ({opt.votes})</span>
                      </div>
                      <div style={{ width: "100%", height: "4px", background: "#e2e8f0", borderRadius: "999px" }}>
                        <div style={{ height: "100%", background: "#10b981", width: `${opt.pct}%`, borderRadius: "999px" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SCHEDULED MASTERCLASSES CATALOG */}
        <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: 0 }}>
              Scheduled Live Masterclasses & Archives
            </h3>
            <span style={{ fontSize: "12px", color: "var(--sarthi-text-muted, #64748b)" }}>
              {liveClasses.length} Masterclasses Configured
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", color: "var(--sarthi-text-muted, #64748b)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Date & Time</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Masterclass Topic</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Specialization</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Cohort</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {liveClasses.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--sarthi-border, #f1f5f9)" }}>
                    <td style={{ padding: "14px" }}>
                      <div style={{ fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>
                        {item.day} {item.month} 2026
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--sarthi-text-muted, #64748b)" }}>{item.time}</div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>{item.title}</div>
                      <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>
                        Passcode: <code>{item.passcode || "IMD-TRAINER-2026"}</code>
                      </div>
                    </td>
                    <td style={{ padding: "14px", color: "var(--sarthi-text-body, #334155)" }}>{item.courseName}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ fontSize: "12px", background: "var(--sarthi-surface-subtle, #f8faf9)", padding: "3px 8px", borderRadius: "6px", border: "1px solid var(--sarthi-border, #e2e8f0)" }}>
                        {item.batch || "Batch 2025-26"}
                      </span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "3px 8px",
                          borderRadius: "999px",
                          background: (item.status || "").toLowerCase() === "completed" ? "#dcfce7" : "#ecfdf5",
                          color: (item.status || "").toLowerCase() === "completed" ? "#166534" : "#065f46",
                          border: (item.status || "").toLowerCase() === "completed" ? "1px solid #bbf7d0" : "1px solid #a7f3d0",
                        }}
                      >
                        {(item.status || "SCHEDULED").toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <button
                        type="button"
                        className="db-btn-primary"
                        style={{ padding: "6px 14px", fontSize: "12px", borderRadius: "8px" }}
                        onClick={() => alert(`Launching masterclass: ${item.title}`)}
                      >
                        Launch Room
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TrainerShell>
  );
}
