"use client";

import React, { useState, useRef, useEffect } from "react";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { EmptyState } from "@/components/dashboard/StateViews";

export default function MessagesPage() {
  const { conversations, sendMessage, student } = useStudent();
  const [selectedConvId, setSelectedConvId] = useState(conversations[0]?.id || "conv-sharma");
  const [messageText, setMessageText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(selectedConvId, messageText);
    setMessageText("");
  };

  const quickReplies = [
    "Understood, thank you!",
    "I have uploaded the simulation dataset.",
    "When is our next live revision session?",
  ];

  return (
    <StudentShell placeholder="Search messages, instructors, or batch peers...">
      <div
        style={{
          padding: "24px 32px 40px",
          maxWidth: "1360px",
          margin: "0 auto",
          width: "100%",
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Apple-style Page Header */}
        <div style={{ marginBottom: "16px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              ACADEMIC DISPATCH & CHANNELS
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
            Messages
          </h1>
        </div>

        {/* 2-Pane Clean Apple Inbox Container */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "320px minmax(0, 1fr)",
            background: "#ffffff",
            borderRadius: "18px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Left Pane: Conversation Threads List */}
          <div
            style={{
              borderRight: "1px solid rgba(0, 0, 0, 0.06)",
              display: "flex",
              flexDirection: "column",
              background: "#fafbfc",
            }}
          >
            {/* Search filter input */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#ffffff",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "10px",
                  padding: "7px 12px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "12.5px",
                    background: "transparent",
                    color: "#111827",
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
              {filteredConversations.length === 0 ? (
                <div style={{ padding: "28px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 4px 0", fontWeight: "500" }}>Your inbox is quiet.</p>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>No conversations match your search.</span>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedConvId;
                  const lastMsg = conv.messages[conv.messages.length - 1];

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: "12px",
                        border: "none",
                        background: isSelected ? "#f0fdf4" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "11px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        marginBottom: "3px",
                      }}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={conv.avatar || "/images/student-img-1.jpg"}
                          alt={conv.name}
                          style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        {conv.online && (
                          <span
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#10b981",
                              border: "2px solid #ffffff",
                            }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4
                            style={{
                              fontSize: "13px",
                              fontWeight: isSelected ? "700" : "600",
                              color: isSelected ? "#065f46" : "#111827",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {conv.name}
                          </h4>
                          <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                            {lastMsg?.time || "Active"}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "11.5px",
                            color: isSelected ? "#047857" : "#6b7280",
                            margin: "2px 0 0 0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lastMsg ? lastMsg.text : conv.role}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            background: "var(--sarthi-primary)",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: "700",
                            borderRadius: "999px",
                            padding: "2px 6px",
                            flexShrink: 0,
                          }}
                        >
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Active Thread */}
          {activeConversation ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ffffff" }}>
              {/* Header */}
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={activeConversation.avatar || "/images/student-img-1.jpg"}
                    alt={activeConversation.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>
                      {activeConversation.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: activeConversation.online ? "#10b981" : "#9ca3af",
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>
                        {activeConversation.role} • {activeConversation.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "var(--sarthi-primary)",
                    background: "var(--sarthi-mint-100)",
                    padding: "3px 9px",
                    borderRadius: "999px",
                  }}
                >
                  Direct Academic Channel
                </span>
              </div>

              {/* Messages scroll area */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.sender === "student" || msg.sender === "me";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "10px 14px",
                          borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                          background: isMe ? "var(--sarthi-primary)" : "#f3f4f6",
                          color: isMe ? "#ffffff" : "#1f2937",
                          fontSize: "13px",
                          lineHeight: 1.45,
                          boxShadow: isMe ? "0 2px 6px rgba(16, 185, 129, 0.2)" : "none",
                        }}
                      >
                        {msg.text}
                      </div>
                      <span style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px", padding: "0 4px" }}>
                        {msg.time}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestions */}
              <div style={{ padding: "8px 20px", display: "flex", gap: "8px", overflowX: "auto", borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sendMessage(selectedConvId, qr);
                    }}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "999px",
                      padding: "4px 12px",
                      fontSize: "11px",
                      color: "#4b5563",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Chat Composer */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: "14px 20px",
                  borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder={`Reply to ${activeConversation.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13px",
                    outline: "none",
                    background: "#ffffff",
                    color: "#111827",
                  }}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "none",
                    background: messageText.trim() ? "var(--sarthi-primary)" : "#e5e7eb",
                    color: messageText.trim() ? "#ffffff" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: messageText.trim() ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>Send</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <EmptyState
                title="Your inbox is quiet"
                description="Select a contact from the left pane to start communicating."
              />
            </div>
          )}
        </div>
      </div>
    </StudentShell>
  );
}
