"use client";

import React, { useState } from "react";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";

export default function SettingsPage() {
  const { settings, saveSettings, student } = useStudent();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [name, setName] = useState(settings.name || student.name || "Mohit Raj");
  const [email, setEmail] = useState(settings.email || student.email || "student.demo@imd.gov.in");
  const [role, setRole] = useState(settings.role || student.role || "IMD Meteorological Trainee");
  const [division, setDivision] = useState(settings.division || "Numerical Weather Prediction (NWP) Division");
  const [bio, setBio] = useState(
    settings.bio ||
      "Meteorological officer and trainee specializing in operational satellite remote sensing, numerical weather modeling, and Doppler radar analysis."
  );
  const [phone, setPhone] = useState(settings.phone || "+91 98765 43210");
  const [location, setLocation] = useState(settings.location || "New Delhi, India (IMD Headquarters)");

  // Account State
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST +05:30)");
  const [language, setLanguage] = useState("English (India)");

  // Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Notifications State
  const [notifications, setNotifications] = useState(
    settings.notifications || {
      emailAlerts: true,
      liveClassReminders: true,
      assignmentDeadlines: true,
      quizAnnouncements: true,
      chatMessages: true,
    }
  );

  // Preferences State
  const [preferences, setPreferences] = useState({
    theme: "light",
    videoQuality: "1080p",
    autoplay: true,
    studyReminder: "Daily (09:00 AM)",
  });

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveSettings({
      ...settings,
      name,
      email,
      role,
      division,
      bio,
      phone,
      location,
    });
    triggerToast("Profile identity updated successfully.");
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    triggerToast("Account preferences updated successfully.");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPass) {
      alert("Please enter your current password.");
      return;
    }
    if (newPass.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      alert("New passwords do not match.");
      return;
    }
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    triggerToast("Password credentials changed successfully.");
  };

  const handleToggleNotif = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    saveSettings({ ...settings, notifications: updated });
    triggerToast("Notification preferences updated.");
  };

  return (
    <StudentShell placeholder="Search settings, preferences, or account data...">
      <div style={{ padding: "28px 36px 64px", maxWidth: "1000px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Apple-style Page Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              PORTAL CONFIGURATION
            </span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0", letterSpacing: "-0.6px" }}>
            Settings
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, fontWeight: "400" }}>
            Manage your personal profile, credentials, notifications, and portal preferences.
          </p>
        </div>

        {/* 5-Tab Apple Segmented Navigation */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "28px",
            background: "#f3f4f6",
            padding: "4px",
            borderRadius: "12px",
            width: "fit-content",
          }}
        >
          {[
            { id: "profile", label: "Profile" },
            { id: "account", label: "Account" },
            { id: "notifications", label: "Notifications" },
            { id: "preferences", label: "Preferences" },
            { id: "security", label: "Security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === tab.id ? "#ffffff" : "transparent",
                color: activeTab === tab.id ? "#111827" : "#6b7280",
                fontWeight: activeTab === tab.id ? "600" : "500",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0, 0, 0, 0.08)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==============================================================
            TAB 1: PROFILE
            ============================================================== */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Avatar Row */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
              }}
            >
              <img
                src={student.avatar || "/images/student-img-1.jpg"}
                alt={name}
                style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "2px solid #10b981" }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 3px 0" }}>
                  {name}
                </h4>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 10px 0" }}>
                  Cadet ID: IMD-2026-CADET-8503 • Active Session
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => triggerToast("Avatar upload feature ready.")}
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      borderRadius: "8px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--sarthi-primary)",
                      cursor: "pointer",
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Fields Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Cadre & Designation
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Department / Division
                </label>
                <input
                  type="text"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Academic & Professional Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Station / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  border: "none",
                  background: "var(--sarthi-primary)",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* ==============================================================
            TAB 2: ACCOUNT
            ============================================================== */}
        {activeTab === "account" && (
          <form onSubmit={handleSaveAccount} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Cadet Registry ID
                </label>
                <input
                  type="text"
                  disabled
                  value="IMD-2026-CADET-8503"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    background: "#f9fafb",
                    fontSize: "13.5px",
                    color: "#6b7280",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Batch Enlistment Date
                </label>
                <input
                  type="text"
                  disabled
                  value="15 January 2026"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    background: "#f9fafb",
                    fontSize: "13.5px",
                    color: "#6b7280",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                >
                  <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
                  <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Portal Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                >
                  <option value="English (India)">English (India)</option>
                  <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  border: "none",
                  background: "var(--sarthi-primary)",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Save Account Settings
              </button>
            </div>
          </form>
        )}

        {/* ==============================================================
            TAB 3: NOTIFICATIONS
            ============================================================== */}
        {activeTab === "notifications" && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>
              Notification Alerts & Broadcasts
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { key: "emailAlerts", title: "Daily Digest & Announcements", desc: "Receive summary briefs of new bulletins from faculty." },
                { key: "liveClassReminders", title: "Live Class Reminders", desc: "Receive automated alerts 15 minutes before satellite radar sessions." },
                { key: "assignmentDeadlines", title: "Assignment Deadlines", desc: "Get notified 24 hours before submission windows close." },
                { key: "quizAnnouncements", title: "Assessment Results & Feedback", desc: "Instant alert upon faculty grading of your simulations." },
                { key: "chatMessages", title: "Direct Faculty Messages", desc: "Sound and desktop notifications on incoming faculty replies." },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: "13.5px", fontWeight: "600", color: "#111827", margin: "0 0 2px 0" }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleNotif(item.key)}
                    style={{
                      width: "44px",
                      height: "24px",
                      borderRadius: "999px",
                      border: "none",
                      background: notifications[item.key] ? "var(--sarthi-primary)" : "#e5e7eb",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: notifications[item.key] ? "22px" : "2px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                        transition: "left 0.2s ease",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 4: PREFERENCES
            ============================================================== */}
        {activeTab === "preferences" && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>
              Portal Study Preferences
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Interface Theme
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) => {
                    setPreferences({ ...preferences, theme: e.target.value });
                    triggerToast("Theme preference saved.");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                >
                  <option value="light">Sarthi Crisp Light Mode (Standard)</option>
                  <option value="system">Match System Settings</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Stream Video Quality
                </label>
                <select
                  value={preferences.videoQuality}
                  onChange={(e) => {
                    setPreferences({ ...preferences, videoQuality: e.target.value });
                    triggerToast("Video quality saved.");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                >
                  <option value="1080p">High Definition (1080p Full HD)</option>
                  <option value="720p">Standard HD (720p Data Saver)</option>
                  <option value="auto">Auto Adapt to Network</option>
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px" }}>
                <div>
                  <h4 style={{ fontSize: "13.5px", fontWeight: "600", color: "#111827", margin: "0 0 2px 0" }}>
                    Auto-advance Lessons
                  </h4>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                    Automatically queue the next lesson upon module video completion.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreferences({ ...preferences, autoplay: !preferences.autoplay });
                    triggerToast("Autoplay preference updated.");
                  }}
                  style={{
                    width: "44px",
                    height: "24px",
                    borderRadius: "999px",
                    border: "none",
                    background: preferences.autoplay ? "var(--sarthi-primary)" : "#e5e7eb",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: preferences.autoplay ? "22px" : "2px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      transition: "left 0.2s ease",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 5: SECURITY
            ============================================================== */}
        {activeTab === "security" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Password Change */}
            <form
              onSubmit={handleChangePassword}
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 }}>
                Change Password
              </h3>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "13.5px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min 8 characters"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      fontSize: "13.5px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      fontSize: "13.5px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "10px",
                    border: "none",
                    background: "var(--sarthi-primary)",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Update Password
                </button>
              </div>
            </form>

            {/* 2-Factor Authentication */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
              }}
            >
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0" }}>
                  Two-Factor Authentication (2FA)
                </h4>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                  Secures your trainee portal login with government authentication codes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  triggerToast(twoFactorEnabled ? "2FA disabled." : "2FA enabled.");
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: twoFactorEnabled ? "#f0fdf4" : "#f9fafb",
                  color: twoFactorEnabled ? "var(--sarthi-primary)" : "#6b7280",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {twoFactorEnabled ? "✓ Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div
            style={{
              position: "fixed",
              bottom: "32px",
              right: "32px",
              background: "#064e3b",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "600",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 9999,
            }}
          >
            <span>✓</span>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
