"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConvId, setActiveConvId] = useState("conv-t-1");
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState("doubts"); // 'doubts' | 'broadcasts'

  const {
    conversations,
    broadcasts,
    sendReplyToConversation,
    setActiveModal,
  } = useTrainer();

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;
    sendReplyToConversation(activeConv.id, replyText.trim());
    setReplyText("");
  };

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search trainee messages, doubts...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                COMMUNICATION & BROADCAST DESK
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Trainee Inquiries & Broadcasts
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Resolve technical meteorological queries, review lab doubts, and broadcast announcements to probationer cohorts.
            </p>
          </div>

          <button
            type="button"
            className="db-btn-primary"
            onClick={() => setActiveModal({ type: "broadcast", data: null })}
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Dispatch Broadcast</span>
          </button>
        </div>

        {/* Tab Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("doubts")}
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "700",
              border: activeTab === "doubts" ? "1px solid var(--sarthi-primary, #024a3a)" : "1px solid var(--sarthi-border, #e2e8f0)",
              background: activeTab === "doubts" ? "var(--sarthi-primary, #024a3a)" : "#ffffff",
              color: activeTab === "doubts" ? "#ffffff" : "var(--sarthi-text-body, #334155)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            Trainee Inquiries ({conversations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("broadcasts")}
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "700",
              border: activeTab === "broadcasts" ? "1px solid var(--sarthi-primary, #024a3a)" : "1px solid var(--sarthi-border, #e2e8f0)",
              background: activeTab === "broadcasts" ? "var(--sarthi-primary, #024a3a)" : "#ffffff",
              color: activeTab === "broadcasts" ? "#ffffff" : "var(--sarthi-text-body, #334155)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            Broadcast History ({broadcasts.length})
          </button>
        </div>

        {activeTab === "doubts" ? (
          /* 2-Column Chat Interface */
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", height: "640px" }}>
            {/* Conversation List */}
            <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "16px", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--sarthi-text-muted, #64748b)", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.08em" }}>
                Active Threads
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {conversations.map((conv) => {
                  const isSelected = conv.id === activeConv?.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        background: isSelected ? "var(--sarthi-mint-50, #e8f5ee)" : "transparent",
                        border: isSelected ? "1px solid #a7f3d0" : "1px solid transparent",
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img src={conv.avatar || "/images/student-img-1.jpg"} alt={conv.studentName} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: "700", fontSize: "13px", color: "var(--sarthi-text-heading, #0a2920)" }}>{conv.studentName}</span>
                          <span style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>{conv.lastTime}</span>
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--sarthi-text-muted, #64748b)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {conv.topic}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conversation Messages */}
            <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              {activeConv ? (
                <>
                  <div style={{ borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", paddingBottom: "14px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)" }}>{activeConv.studentName}</h3>
                      <div style={{ fontSize: "12px", color: "var(--sarthi-text-muted, #64748b)" }}>Topic: {activeConv.topic} &bull; {activeConv.courseTitle}</div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "999px", background: "#dcfce7", color: "#166534" }}>
                      Active Inquiry
                    </span>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
                    {activeConv.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: msg.sender === "trainer" ? "flex-end" : "flex-start",
                          maxWidth: "75%",
                          padding: "12px 16px",
                          borderRadius: msg.sender === "trainer" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                          background: msg.sender === "trainer" ? "var(--sarthi-primary, #024a3a)" : "var(--sarthi-surface-subtle, #f8faf9)",
                          color: msg.sender === "trainer" ? "#ffffff" : "var(--sarthi-text-body, #334155)",
                          border: msg.sender === "trainer" ? "none" : "1px solid var(--sarthi-border, #e2e8f0)",
                          fontSize: "13px",
                          lineHeight: 1.45,
                        }}
                      >
                        <div>{msg.text}</div>
                        <div style={{ fontSize: "10.5px", marginTop: "4px", opacity: 0.75, textAlign: msg.sender === "trainer" ? "right" : "left" }}>
                          {msg.time}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", marginTop: "16px", borderTop: "1px solid var(--sarthi-border, #e2e8f0)", paddingTop: "14px" }}>
                    <input
                      type="text"
                      placeholder="Type official instructor clarification..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                    />
                    <button type="submit" className="db-btn-primary" style={{ padding: "0 20px", borderRadius: "10px", fontSize: "13px" }}>
                      Reply
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ margin: "auto", color: "var(--sarthi-text-muted, #64748b)" }}>
                  Select an inquiry thread to view messages.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Broadcasts List */
          <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {broadcasts.map((bc) => (
                <div key={bc.id} style={{ padding: "16px", borderRadius: "12px", background: "var(--sarthi-surface-subtle, #f8faf9)", border: "1px solid var(--sarthi-border, #e2e8f0)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontWeight: "800", fontSize: "14px", color: "var(--sarthi-text-heading, #0a2920)" }}>{bc.title}</span>
                    <span style={{ fontSize: "11.5px", color: "var(--sarthi-text-muted, #64748b)" }}>{bc.date}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--sarthi-text-body, #334155)", margin: "0 0 10px 0", lineHeight: 1.45 }}>{bc.content}</p>
                  <div style={{ fontSize: "11px", color: "#059669", fontWeight: "700" }}>
                    Recipients: {bc.targetDivision} &bull; Sent by: {bc.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TrainerShell>
  );
}
