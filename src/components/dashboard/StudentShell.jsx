"use client";

import React, { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";
import { StudentProvider, useStudent } from "@/lib/services/StudentContext";
import "@/app/dashboard/dashboard.css";

function ShellInner({ children, searchQuery, setSearchQuery, placeholder }) {
  const { activeLiveModal, setActiveLiveModal } = useStudent();
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [liveChatMsg, setLiveChatMsg] = useState("");
  const [liveChatLog, setLiveChatLog] = useState([
    { user: "Dr. R. K. Sharma", text: "Welcome trainees. Today we examine the INSAT-3DR split-window radiance fields.", time: "10:01 AM" },
    { user: "Nisha Chand", text: "Good morning Sir, slides are visible clearly.", time: "10:02 AM" },
  ]);

  const handleSendLiveChat = (e) => {
    e.preventDefault();
    if (!liveChatMsg.trim()) return;
    setLiveChatLog((prev) => [
      ...prev,
      { user: "Mohit Raj (You)", text: liveChatMsg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setLiveChatMsg("");
  };

  return (
    <div className="sarthi-dashboard-root">
      {/* Fixed Left Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <main className="db-main-content">
        <StudentHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={placeholder}
        />
        {children}
      </main>

      {/* Interactive Live Virtual Classroom Modal */}
      {activeLiveModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(6, 78, 59, 0.75)",
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
              maxWidth: "1050px",
              height: "90vh",
              maxHeight: "700px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--sarthi-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fcfdfc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff", animation: "pulse 1s infinite" }} />
                  LIVE
                </span>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--sarthi-text-heading)", margin: 0 }}>
                    {activeLiveModal.title}
                  </h3>
                  <p style={{ fontSize: "11px", color: "var(--sarthi-text-muted)", margin: 0 }}>
                    {activeLiveModal.courseName} • Instructor: {activeLiveModal.instructor}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveLiveModal(null)}
                style={{
                  background: "var(--sarthi-mint-50)",
                  border: "1px solid var(--sarthi-border)",
                  borderRadius: "10px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--sarthi-pine-dark)",
                  cursor: "pointer",
                }}
              >
                ✕ Leave Session
              </button>
            </div>

            {/* Modal Body: 2 columns (Video presentation + Live sidebar) */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Main Presentation View */}
              <div
                style={{
                  flex: 1,
                  background: "#0a1f18",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                {/* Meteorological presentation graphics simulation */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Grid Lines */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "radial-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />

                  {/* Presenter Video PiP */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      width: "140px",
                      height: "95px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid #10b981",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    }}
                  >
                    <img
                      src={activeLiveModal.instructorAvatar || "/images/student-img-1.jpg"}
                      alt="Instructor"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        insetInline: 0,
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        fontSize: "9px",
                        fontWeight: "700",
                        padding: "2px 4px",
                        textAlign: "center",
                      }}
                    >
                      {activeLiveModal.instructor}
                    </div>
                  </div>

                  {/* Satellite / Radar Diagram Mock */}
                  <div style={{ textAlign: "center", zIndex: 2, padding: "20px" }}>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "2px solid #10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px auto",
                        animation: "pulse 2s infinite",
                      }}
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                    </div>
                    <h4 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "800", marginBottom: "6px" }}>
                      INSAT-3DR Radiance Matrix Stream
                    </h4>
                    <p style={{ color: "#94a3b8", fontSize: "12px", maxWidth: "400px", margin: "0 auto" }}>
                      Live calibrated sensor payload active. Brightness temperature gradient over 10.8 µm TIR1 channel is currently live-streaming to IMD trainees.
                    </p>
                  </div>

                  {/* Bottom Video Controls */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "rgba(15, 23, 42, 0.8)",
                      padding: "8px 18px",
                      borderRadius: "999px",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <button
                      onClick={() => setMicMuted(!micMuted)}
                      style={{
                        background: micMuted ? "#ef4444" : "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "#fff",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={micMuted ? "Unmute Mic" : "Mute Mic"}
                    >
                      {micMuted ? "🔇" : "🎙️"}
                    </button>
                    <button
                      onClick={() => setCamOff(!camOff)}
                      style={{
                        background: camOff ? "#ef4444" : "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "#fff",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={camOff ? "Turn On Camera" : "Turn Off Camera"}
                    >
                      {camOff ? "🚫" : "📹"}
                    </button>
                    <button
                      onClick={() => setHandRaised(!handRaised)}
                      style={{
                        background: handRaised ? "#f59e0b" : "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "#fff",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={handRaised ? "Lower Hand" : "Raise Hand"}
                    >
                      ✋
                    </button>
                  </div>
                </div>
              </div>

              {/* Classroom Chat & Attendees Pane */}
              <div
                style={{
                  width: "300px",
                  background: "#ffffff",
                  borderLeft: "1px solid var(--sarthi-border)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--sarthi-border)", fontWeight: "700", fontSize: "13px" }}>
                  Classroom Chat & Activity
                </div>

                {/* Chat Log */}
                <div style={{ flex: 1, padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {liveChatLog.map((chat, idx) => (
                    <div key={idx} style={{ background: "var(--sarthi-mint-50)", padding: "8px 10px", borderRadius: "10px", border: "1px solid var(--sarthi-border-light)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", color: "var(--sarthi-pine-dark)" }}>
                        <span>{chat.user}</span>
                        <span style={{ color: "var(--sarthi-text-light)", fontWeight: "500", fontSize: "10px" }}>{chat.time}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--sarthi-text-body)", marginTop: "4px" }}>{chat.text}</div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendLiveChat} style={{ padding: "12px", borderTop: "1px solid var(--sarthi-border)", display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    value={liveChatMsg}
                    onChange={(e) => setLiveChatMsg(e.target.value)}
                    placeholder="Ask a question..."
                    style={{
                      flex: 1,
                      border: "1px solid var(--sarthi-border)",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "var(--sarthi-primary)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentShell({ children, searchQuery, setSearchQuery, placeholder }) {
  return (
    <ShellInner
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder={placeholder}
    >
      {children}
    </ShellInner>
  );
}
