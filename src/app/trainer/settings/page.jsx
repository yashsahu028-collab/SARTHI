"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerSettingsPage() {
  const { trainer, updateTrainerProfile } = useTrainer();
  const [name, setName] = useState(trainer.name);
  const [title, setTitle] = useState(trainer.title);
  const [division, setDivision] = useState(trainer.division);
  const [officeHours, setOfficeHours] = useState(trainer.officeHours);
  const [roomLocation, setRoomLocation] = useState(trainer.roomLocation);
  const [bio, setBio] = useState(trainer.bio);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    updateTrainerProfile({
      name,
      title,
      division,
      officeHours,
      roomLocation,
      bio,
    });
    setSavedMsg("Faculty profile & preferences updated successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <TrainerShell placeholder="Search settings...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              FACULTY DOSSIER & PREFERENCES
            </span>
          </div>
          <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Faculty Profile & LMS Settings
          </h1>
          <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0 }}>
            Manage official credentials, division designation, consultation office hours, and grading templates.
          </p>
        </div>

        {savedMsg && (
          <div style={{ background: "#dcfce7", border: "1px solid #10b981", color: "#166534", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "13.5px", fontWeight: "700" }}>
            ✓ {savedMsg}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", paddingBottom: "20px" }}>
              <img
                src={trainer.avatar || "/images/student-img-1.jpg"}
                alt={trainer.name}
                style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "3px solid #059669" }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)" }}>{trainer.name}</h3>
                <div style={{ fontSize: "13px", color: "var(--sarthi-text-muted, #64748b)", marginTop: "2px" }}>{trainer.email}</div>
                <div style={{ fontSize: "12px", color: "#059669", fontWeight: "700", marginTop: "4px" }}>
                  India Meteorological Department &bull; Ministry of Earth Sciences
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>Full Name & Honorific:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>Official Designation:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>Division / Directorate:</label>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                required
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>Consultation Office Hours:</label>
                <input
                  type="text"
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>Office Location / Room:</label>
                <input
                  type="text"
                  value={roomLocation}
                  onChange={(e) => setRoomLocation(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>Scientific Biography & Specialization:</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--sarthi-border, #e2e8f0)", fontSize: "13px", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button
                type="submit"
                className="db-btn-primary"
                style={{ padding: "10px 24px", fontSize: "13.5px", borderRadius: "10px" }}
              >
                Save Dossier Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </TrainerShell>
  );
}
