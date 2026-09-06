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
  const [activeTab, setActiveTab] = useState("attendees"); // 'attendees' | 'poll' | 'chat'
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("Which channel best isolates low-level sea fog during nighttime over the Arabian Sea?");
  const [pollOptions, setPollOptions] = useState([
    { text: "TIR1 (10.8 µm) - TIR2 (12.0 µm)", votes: 24, pct: 45 },
    { text: "MIR (3.9 µm) - TIR1 (10.8 µm) Fog Mask", votes: 28, pct: 52 },
    { text: "WV (6.7 µm) Upper Channel", votes: 2, pct: 3 },
  ]);
  const [pollSubmitted, setPollSubmitted] = useState(true);

  const { liveClasses, trainees, setActiveModal } = useTrainer();

  const connectedAttendees = [
    { id: "std-1", name: "Mohit Raj", division: "NWP Division", mic: false, handRaised: true, avatar: "/images/student-img-1.jpg" },
    { id: "std-2", name: "Priya Sharma", division: "Satellite Div.", mic: false, handRaised: false, avatar: "/images/student-img-2.jpg" },
    { id: "std-3", name: "Rahul Verma", division: "Radar Div.", mic: false, handRaised: false, avatar: "/images/student-img-3.jpg" },
    { id: "std-5", name: "Vikram Malhotra", division: "Cyclone Warning", mic: true, handRaised: false, avatar: "/images/student-img-1.jpg" },
    { id: "std-7", name: "Sneha Mukherjee", division: "Monsoon Center", mic: false, handRaised: true, avatar: "/images/student-img-2.jpg" },
  ];

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search live sessions, recordings, or agendas...">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Live Studio & Masterclass Conductor
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Broadcast live meteorological masterclasses, conduct interactive polls, and monitor real-time trainee engagement.
          </p>
        </div>

        <button
          type="button"
          className="trainer-quick-btn trainer-btn-green"
          onClick={() => setActiveModal({ type: "schedule_live", data: null })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
          <span>Schedule New Session</span>
        </button>
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
              👥 48 Trainees Connected &bull; 00:42:15
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
              {isMicOn ? "🎙️" : "🔇"}
            </button>

            <button
              type="button"
              className={`trainer-ctrl-btn ${isCamOn ? "active" : ""}`}
              onClick={() => setIsCamOn(!isCamOn)}
              title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {isCamOn ? "📹" : "🚫"}
            </button>

            <button
              type="button"
              className={`trainer-ctrl-btn ${isSharingScreen ? "active" : ""}`}
              onClick={() => setIsSharingScreen(!isSharingScreen)}
              title="Share Screen / Radar Feed"
            >
              🖥️
            </button>

            <button
              type="button"
              className="trainer-ctrl-btn"
              onClick={() => setActiveTab("poll")}
              title="Launch Instant Poll"
            >
              📊
            </button>

            <button
              type="button"
              className="trainer-ctrl-btn danger"
              onClick={() => setIsLiveActive(!isLiveActive)}
              title={isLiveActive ? "End Live Session" : "Resume Live Session"}
            >
              {isLiveActive ? "⏹️" : "▶️"}
            </button>
          </div>
        </div>

        {/* Live Side Panel: Attendees, Live Polls, or Chat */}
        <div className="trainer-section-card" style={{ display: "flex", flexDirection: "column", padding: "16px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--tr-border)", paddingBottom: "10px", marginBottom: "14px", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("attendees")}
              style={{
                flex: 1,
                padding: "6px 0",
                fontSize: "12.5px",
                fontWeight: "700",
                border: "none",
                background: activeTab === "attendees" ? "var(--tr-surface-alt)" : "transparent",
                color: activeTab === "attendees" ? "var(--tr-text-heading)" : "var(--tr-text-muted)",
                borderRadius: "6px",
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
                padding: "6px 0",
                fontSize: "12.5px",
                fontWeight: "700",
                border: "none",
                background: activeTab === "poll" ? "var(--tr-surface-alt)" : "transparent",
                color: activeTab === "poll" ? "var(--tr-text-heading)" : "var(--tr-text-muted)",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Live Poll
            </button>
          </div>

          {activeTab === "attendees" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--tr-text-muted)" }}>Raised Hands (2)</span>
                <span style={{ fontSize: "11px", color: "var(--tr-accent-teal)", cursor: "pointer", fontWeight: "700" }}>Mute All</span>
              </div>

              {connectedAttendees.map((att) => (
                <div key={att.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: att.handRaised ? "#fef3c7" : "var(--tr-surface-alt)", borderRadius: "8px", border: att.handRaised ? "1px solid #f59e0b" : "1px solid transparent" }}>
                  <img src={att.avatar} alt={att.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                      {att.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>{att.division}</div>
                  </div>
                  {att.handRaised && <span title="Hand raised" style={{ fontSize: "14px" }}>✋</span>}
                  <span style={{ fontSize: "13px" }}>{att.mic ? "🎙️" : "🔇"}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "poll" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--tr-text-heading)" }}>
                Active Interactive Poll
              </div>
              <div style={{ fontSize: "13px", color: "var(--tr-text-body)", background: "var(--tr-surface-alt)", padding: "10px 12px", borderRadius: "8px", fontWeight: "600" }}>
                {pollQuestion}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} style={{ background: "#ffffff", border: "1px solid var(--tr-border)", borderRadius: "8px", padding: "8px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                      <span>{opt.text}</span>
                      <span style={{ fontWeight: "700", color: "#059669" }}>{opt.pct}% ({opt.votes})</span>
                    </div>
                    <div className="trainer-progress-bar-wrap" style={{ height: "4px", marginBottom: 0 }}>
                      <div style={{ height: "100%", background: "#10b981", width: `${opt.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="trainer-quick-btn trainer-btn-outline"
                style={{ width: "100%", justifyContent: "center", height: "34px", fontSize: "12px", marginTop: "10px" }}
                onClick={() => alert("New poll creator initialized!")}
              >
                + Launch New Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SCHEDULED MASTERCLASSES CATALOG */}
      <div className="trainer-section-card">
        <h2 className="trainer-section-title" style={{ marginBottom: "16px" }}>
          <span>📅</span> Scheduled Live Classes & Recordings Archive
        </h2>

        <div className="trainer-table-wrap">
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Masterclass Topic</th>
                <th>Course / Specialization</th>
                <th>Target Cohort</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveClasses.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: "700", color: "var(--tr-text-heading)" }}>
                      {item.day} {item.month} 2026
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>{item.time}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: "700", color: "var(--tr-text-heading)" }}>{item.title}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>
                      Passcode: <code>{item.passcode || "IMD-TRAINER-2026"}</code>
                    </div>
                  </td>
                  <td>{item.courseName}</td>
                  <td>
                    <span style={{ fontSize: "12px" }}>{item.batch}</span>
                  </td>
                  <td>
                    <span className={`trainer-status-tag ${item.status === "completed" ? "tag-graded" : "tag-pending"}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {item.status === "completed" ? (
                      <a
                        href={item.recordingUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="trainer-quick-btn trainer-btn-outline"
                        style={{ height: "30px", padding: "0 10px", fontSize: "11.5px", textDecoration: "none" }}
                      >
                        View Recording
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="trainer-quick-btn trainer-btn-green"
                        style={{ height: "30px", padding: "0 10px", fontSize: "11.5px" }}
                        onClick={() => alert(`Launching masterclass room: ${item.title}`)}
                      >
                        Launch Room
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TrainerShell>
  );
}
