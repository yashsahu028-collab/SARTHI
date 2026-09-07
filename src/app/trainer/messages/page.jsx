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
    if (!replyText.trim()) return;
    sendReplyToConversation(activeConv.id, replyText.trim());
    setReplyText("");
  };

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search trainee messages, doubts...">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Trainee Doubt Clearance & Broadcasts
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Resolve technical meteorological queries and broadcast urgent lab/weather bulletins to entire cohorts.
          </p>
        </div>

        <button
          type="button"
          className="trainer-quick-btn trainer-btn-green"
          onClick={() => setActiveModal({ type: "broadcast", data: null })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Dispatch New Broadcast</span>
        </button>
      </div>

      {/* TOP TABS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("doubts")}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "13.5px",
            fontWeight: "700",
            border: activeTab === "doubts" ? "1px solid var(--tr-primary)" : "1px solid var(--tr-border)",
            background: activeTab === "doubts" ? "var(--tr-primary)" : "#ffffff",
            color: activeTab === "doubts" ? "#ffffff" : "var(--tr-text-body)",
            cursor: "pointer",
          }}
        >
          Trainee Doubts ({conversations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("broadcasts")}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "13.5px",
            fontWeight: "700",
            border: activeTab === "broadcasts" ? "1px solid var(--tr-primary)" : "1px solid var(--tr-border)",
            background: activeTab === "broadcasts" ? "var(--tr-primary)" : "#ffffff",
            color: activeTab === "broadcasts" ? "#ffffff" : "var(--tr-text-body)",
            cursor: "pointer",
          }}
        >
          Batch Broadcast History ({broadcasts.length})
        </button>
      </div>

      {activeTab === "doubts" ? (
        /* 2-COLUMN CHAT INTERFACE */
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", height: "620px" }}>
          {/* CONVERSATION LIST */}
          <div className="trainer-section-card" style={{ padding: "14px", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--tr-text-muted)", textTransform: "uppercase", marginBottom: "10px", padding: "0 4px" }}>
              Active Doubt Threads
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
                      borderRadius: "var(--tr-radius-md)",
                      background: isSelected ? "var(--tr-primary-light)" : "var(--tr-surface-alt)",
                      border: isSelected ? "1px solid var(--tr-accent-teal)" : "1px solid var(--tr-border)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={conv.studentAvatar || "/images/student-img-1.jpg"} alt={conv.studentName} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                        <span style={{ fontWeight: "700", fontSize: "13.5px", color: "var(--tr-text-heading)" }}>{conv.studentName}</span>
                      </div>
                      {conv.isUrgent && (
                        <span style={{ fontSize: "10px", background: "#fee2e2", color: "#991b1b", padding: "1px 6px", borderRadius: "4px", fontWeight: "800" }}>
                          URGENT
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "11px", color: "var(--tr-accent-teal)", fontWeight: "700", marginBottom: "4px" }}>
                      {conv.courseContext} &bull; {conv.division}
                    </div>

                    <div style={{ fontSize: "12px", color: "var(--tr-text-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {conv.lastMessage?.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CHAT THREAD */}
          {activeConv ? (
            <div className="trainer-section-card" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Thread Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "14px", borderBottom: "1px solid var(--tr-border)", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={activeConv.studentAvatar} alt={activeConv.studentName} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--tr-text-heading)" }}>{activeConv.studentName}</h3>
                    <div style={{ fontSize: "12px", color: "var(--tr-text-muted)" }}>{activeConv.division} &bull; Context: {activeConv.courseContext}</div>
                  </div>
                </div>

                <span className="trainer-status-tag tag-graded">Online</span>
              </div>

              {/* Messages Bubble List */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "8px", marginBottom: "16px" }}>
                {activeConv.messages?.map((msg) => {
                  const isTrainer = msg.sender === "trainer";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isTrainer ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                        background: isTrainer ? "#024a3a" : "var(--tr-surface-alt)",
                        color: isTrainer ? "#ffffff" : "var(--tr-text-body)",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        borderBottomRightRadius: isTrainer ? "2px" : "14px",
                        borderBottomLeftRadius: isTrainer ? "14px" : "2px",
                        boxShadow: "var(--tr-shadow-sm)",
                      }}
                    >
                      <div style={{ fontSize: "13.5px", lineHeight: 1.45 }}>{msg.text}</div>
                      <div style={{ fontSize: "10.5px", color: isTrainer ? "#a7f3d0" : "var(--tr-text-light)", textAlign: "right", marginTop: "4px" }}>
                        {msg.timestamp}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form Input */}
              <form onSubmit={handleSend} style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Type official guidance or scientific clarification..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="trainer-input"
                  style={{ flex: 1, height: "44px" }}
                />
                <button type="submit" className="trainer-quick-btn trainer-btn-green" style={{ height: "44px", padding: "0 20px" }}>
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="trainer-section-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tr-text-muted)" }}>
              Select a trainee doubt thread from the left list.
            </div>
          )}
        </div>
      ) : (
        /* BROADCAST HISTORY TAB */
        <div className="trainer-section-card">
          <h2 className="trainer-section-title" style={{ marginBottom: "16px" }}>
            <span>📢</span> Dispatched Cohort Broadcasts
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {broadcasts.map((bcast) => (
              <div key={bcast.id} style={{ background: "var(--tr-surface-alt)", border: "1px solid var(--tr-border)", borderRadius: "var(--tr-radius-md)", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "var(--tr-text-heading)" }}>
                    {bcast.title}
                  </h3>
                  <span style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>{bcast.sentAt}</span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--tr-accent-teal)", fontWeight: "700", marginBottom: "8px" }}>
                  Target: {bcast.targetBatch} &bull; {bcast.recipientCount || 186} Officers Reached
                </div>

                <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: 1.5 }}>
                  {bcast.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </TrainerShell>
  );
}
