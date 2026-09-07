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
      <div style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Faculty Profile & LMS Preferences
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Manage official credentials, division designation, consultation office hours, and grading templates.
          </p>
        </div>

        {savedMsg && (
          <div style={{ background: "#dcfce7", border: "1px solid #10b981", color: "#166534", padding: "12px 16px", borderRadius: "var(--tr-radius-md)", marginBottom: "20px", fontSize: "13.5px", fontWeight: "700" }}>
            ✓ {savedMsg}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="trainer-section-card" style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
            <h2 className="trainer-section-title" style={{ fontSize: "16px", borderBottom: "1px solid var(--tr-border)", paddingBottom: "12px" }}>
              <span>👨‍🏫</span> Official Faculty Dossier
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img src={trainer.avatar || "/images/student-img-1.jpg"} alt={trainer.name} style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--tr-accent-teal)" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "var(--tr-text-heading)" }}>{trainer.name}</h3>
                <div style={{ fontSize: "13px", color: "var(--tr-text-muted)", marginTop: "2px" }}>{trainer.email}</div>
                <div style={{ fontSize: "12px", color: "#059669", fontWeight: "700", marginTop: "2px" }}>India Meteorological Department (MoES)</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="trainer-form-group">
                <label className="trainer-label">Full Name & Honorific:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="trainer-input" />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-label">Official Designation:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="trainer-input" />
              </div>
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Division / Center:</label>
              <input type="text" value={division} onChange={(e) => setDivision(e.target.value)} required className="trainer-input" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="trainer-form-group">
                <label className="trainer-label">Office Consultation Hours:</label>
                <input type="text" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} className="trainer-input" />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-label">Office Location / Room:</label>
                <input type="text" value={roomLocation} onChange={(e) => setRoomLocation(e.target.value)} className="trainer-input" />
              </div>
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Scientific Biography & Specialization Summary:</label>
              <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="trainer-textarea" />
            </div>
          </div>

          <div className="trainer-section-card" style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            <h2 className="trainer-section-title" style={{ fontSize: "16px", borderBottom: "1px solid var(--tr-border)", paddingBottom: "12px" }}>
              <span>🔔</span> Notification & Alert Triggers
            </h2>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>Instant push alert when trainees submit lab assignments</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>Highlight urgent trainee doubts in Doubt Clearance console</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked />
              <span>Automated email reminder 30 mins before scheduled live masterclasses</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="trainer-quick-btn trainer-btn-green" style={{ height: "44px", padding: "0 28px" }}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </TrainerShell>
  );
}
