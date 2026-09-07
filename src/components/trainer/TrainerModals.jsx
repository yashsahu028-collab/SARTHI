"use client";

import React, { useState } from "react";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerModals() {
  const {
    activeModal,
    setActiveModal,
    addCourse,
    scheduleLiveClass,
    gradeSubmission,
    sendBroadcast,
    courses,
  } = useTrainer();

  if (!activeModal) return null;

  const closeModal = () => setActiveModal(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: activeModal.type === "new_course" ? "560px" : "500px",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.2), 0 0 1px 1px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          overflow: "hidden",
          animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {activeModal.type === "new_course" && (
          <NewCourseModal closeModal={closeModal} addCourse={addCourse} />
        )}
        {activeModal.type === "schedule_live" && (
          <ScheduleLiveModal closeModal={closeModal} scheduleLiveClass={scheduleLiveClass} courses={courses} />
        )}
        {activeModal.type === "grade_submission" && (
          <GradeSubmissionModal closeModal={closeModal} gradeSubmission={gradeSubmission} data={activeModal.data} />
        )}
        {activeModal.type === "broadcast" && (
          <BroadcastModal closeModal={closeModal} sendBroadcast={sendBroadcast} />
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// 1. New Course Modal
function NewCourseModal({ closeModal, addCourse }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Satellite Meteorology");
  const [level, setLevel] = useState("Intermediate");
  const [durationHours, setDurationHours] = useState(16);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await addCourse({
      title: title.trim(),
      category,
      level,
      durationHours: Number(durationHours) || 16,
      description: description.trim() || "Comprehensive syllabus for IMD probationary officers and meteorological specialists.",
      isPublished: publish,
    });
    setIsSubmitting(false);
    closeModal();
  };

  return (
    <div>
      <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Faculty Curriculum Builder
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "4px 0 0" }}>
            Create New Meteorological Course
          </h3>
        </div>
        <button
          onClick={closeModal}
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
        >
          &times;
        </button>
      </div>

      <form onSubmit={(e) => handleSubmit(e, true)} style={{ padding: "24px 28px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Course Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Radar Doppler Velocity & Mesoscale Convective Systems"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Discipline / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#fff" }}
            >
              <option value="Satellite Meteorology">Satellite Meteorology</option>
              <option value="Radar Meteorology">Radar Meteorology</option>
              <option value="NWP Modeling">NWP Modeling</option>
              <option value="Severe Weather">Severe Weather & Cyclones</option>
              <option value="Aviation Meteorology">Aviation Meteorology</option>
              <option value="Climatology">Climatology & Climate Trends</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Proficiency Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#fff" }}
            >
              <option value="Beginner">Beginner (Cadet / Officer Induction)</option>
              <option value="Intermediate">Intermediate (Operational Meteorologist)</option>
              <option value="Advanced">Advanced (Senior Scientist / Specialist)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Course Description & Training Scope
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline syllabus modules, lab datasets (NetCDF/GRIB2), and IMD operational benchmarks..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", resize: "none" }}
          ></textarea>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting || !title.trim()}
            style={{ padding: "10px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            style={{ padding: "10px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", color: "#ffffff", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)" }}
          >
            {isSubmitting ? "Creating..." : "Publish Course →"}
          </button>
        </div>
      </form>
    </div>
  );
}

// 2. Schedule Live Class Modal
function ScheduleLiveModal({ closeModal, scheduleLiveClass, courses }) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00 AM - 11:30 AM IST");
  const [batch, setBatch] = useState("All IMD Probationary Batches");
  const [agenda, setAgenda] = useState("Interactive Radar Data Analysis & Doppler Velocity Profiles");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await scheduleLiveClass({
      title: title.trim(),
      courseId: courseId || courses[0]?.id,
      date,
      time,
      batch,
      agenda: agenda.split("\n").filter(Boolean),
    });
    closeModal();
  };

  return (
    <div>
      <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Live Studio Command
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "4px 0 0" }}>
            Schedule Live Masterclass
          </h3>
        </div>
        <button
          onClick={closeModal}
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Masterclass Topic *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., INSAT-3DR Rapid Scanning & Cyclone Eye Wall Detection"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Associated Course
          </label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#fff" }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Time Slot
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10:00 AM - 11:30 AM IST"
              style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            type="button"
            onClick={closeModal}
            style={{ padding: "10px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: "10px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", color: "#ffffff", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)" }}
          >
            Schedule Live Masterclass →
          </button>
        </div>
      </form>
    </div>
  );
}

// 3. Grade Submission Modal
function GradeSubmissionModal({ closeModal, gradeSubmission, data }) {
  const [score, setScore] = useState(data?.score || 90);
  const [feedback, setFeedback] = useState(data?.feedback || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data?.id) return;
    await gradeSubmission(data.id, {
      score: Number(score),
      feedback: feedback || "Verified according to IMD meteorological guidelines.",
    });
    closeModal();
  };

  return (
    <div>
      <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Faculty Evaluation Desk
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "4px 0 0" }}>
            Evaluate Trainee Submission
          </h3>
        </div>
        <button
          onClick={closeModal}
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
        >
          &times;
        </button>
      </div>

      <div style={{ padding: "20px 28px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{data?.studentName}</div>
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{data?.assignmentTitle}</div>
        {data?.studentNotes && (
          <div style={{ marginTop: "10px", padding: "10px 12px", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12.5px", color: "#334155", fontStyle: "italic" }}>
            &ldquo;{data.studentNotes}&rdquo;
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Awarded Score (0 - {data?.maxScore || 100})
          </label>
          <input
            type="number"
            min="0"
            max={data?.maxScore || 100}
            required
            value={score}
            onChange={(e) => setScore(e.target.value)}
            style={{ width: "120px", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "18px", fontWeight: "700", outline: "none", color: "#059669" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Instructor Feedback & Evaluative Notes
          </label>
          <textarea
            rows="3"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Detail scientific accuracy, data visualization quality, and specific meteorological corrections..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", resize: "none" }}
          ></textarea>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            type="button"
            onClick={closeModal}
            style={{ padding: "10px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: "10px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", color: "#ffffff", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)" }}
          >
            Submit Grade & Notify Trainee →
          </button>
        </div>
      </form>
    </div>
  );
}

// 4. Broadcast Modal
function BroadcastModal({ closeModal, sendBroadcast }) {
  const [title, setTitle] = useState("");
  const [targetBatch, setTargetBatch] = useState("All Active Trainees");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    await sendBroadcast({ title, targetBatch, message });
    closeModal();
  };

  return (
    <div>
      <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            IMD Broadcast System
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "4px 0 0" }}>
            Send Batch Announcement
          </h3>
        </div>
        <button
          onClick={closeModal}
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Announcement Subject *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Mandatory WRF Simulation Lab Deadline Extension"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Broadcast Target Group
          </label>
          <select
            value={targetBatch}
            onChange={(e) => setTargetBatch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#fff" }}
          >
            <option value="All Active Trainees">All Active Trainees (186 Officers)</option>
            <option value="Probationary Batch 2026-A">Probationary Batch 2026-A</option>
            <option value="Radar Specialists (DWR Division)">Radar Specialists (DWR Division)</option>
            <option value="Satellite Meteorology Cadets">Satellite Meteorology Cadets</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
            Message Content *
          </label>
          <textarea
            rows="4"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write official message for trainees..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", resize: "none" }}
          ></textarea>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            type="button"
            onClick={closeModal}
            style={{ padding: "10px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: "10px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", color: "#ffffff", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)" }}
          >
            Broadcast Announcement →
          </button>
        </div>
      </form>
    </div>
  );
}
