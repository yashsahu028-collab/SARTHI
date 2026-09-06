"use client";

import React, { useState } from "react";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerModals() {
  const {
    activeModal,
    setActiveModal,
    courses,
    trainees,
    gradeSubmission,
    addCourse,
    createAssignment,
    scheduleLiveClass,
    sendBroadcast,
    approveCertificate,
  } = useTrainer();

  if (!activeModal) return null;

  const closeModal = () => setActiveModal(null);

  switch (activeModal.type) {
    case "grading":
      return <GradingModal submission={activeModal.data} onClose={closeModal} onGrade={gradeSubmission} />;
    case "new_course":
      return <NewCourseModal onClose={closeModal} onAdd={addCourse} />;
    case "new_assignment":
      return <NewAssignmentModal courses={courses} onClose={closeModal} onAdd={createAssignment} />;
    case "schedule_live":
      return <ScheduleLiveModal courses={courses} onClose={closeModal} onSchedule={scheduleLiveClass} />;
    case "broadcast":
      return <BroadcastModal onClose={closeModal} onBroadcast={sendBroadcast} />;
    case "certificate_preview":
      return <CertificatePreviewModal cert={activeModal.data} onClose={closeModal} onApprove={approveCertificate} />;
    case "trainee_dossier":
      return <TraineeDossierModal trainee={activeModal.data} onClose={closeModal} />;
    default:
      return null;
  }
}

// 1. GRADING MODAL
function GradingModal({ submission, onClose, onGrade }) {
  const [score, setScore] = useState(submission.score || 95);
  const [feedback, setFeedback] = useState(submission.feedback || "Good analytical approach to the INSAT-3DR radiance data. The calibration curve and split-window calculations match standard IMD verification benchmarks.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onGrade(submission.id, { score: Number(score), feedback });
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="trainer-modal-overlay" onClick={onClose}>
      <div className="trainer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal-header">
          <div>
            <h3 className="trainer-modal-title">Evaluate & Grade Submission</h3>
            <div style={{ fontSize: "12px", color: "var(--tr-text-muted)", marginTop: "2px" }}>
              {submission.assignmentTitle}
            </div>
          </div>
          <button className="trainer-modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="trainer-modal-body">
            {/* Trainee Card */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--tr-surface-alt)", padding: "12px 16px", borderRadius: "var(--tr-radius-md)" }}>
              <img src={submission.studentAvatar || "/images/student-img-1.jpg"} alt={submission.studentName} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: "700", color: "var(--tr-text-heading)", fontSize: "14px" }}>{submission.studentName}</div>
                <div style={{ fontSize: "12px", color: "var(--tr-text-muted)" }}>{submission.division} &bull; {submission.studentEmail}</div>
              </div>
              <span className={`trainer-status-tag ${submission.status === "graded" ? "tag-graded" : "tag-pending"}`} style={{ marginLeft: "auto" }}>
                {submission.status.toUpperCase()}
              </span>
            </div>

            {/* Trainee Submitted Notes */}
            <div className="trainer-form-group">
              <label className="trainer-label">Trainee Submission Notes:</label>
              <div style={{ padding: "10px 14px", background: "#ffffff", border: "1px solid var(--tr-border)", borderRadius: "var(--tr-radius-md)", fontSize: "13px", color: "#475569" }}>
                {submission.studentNotes || "No notes provided by trainee."}
              </div>
            </div>

            {/* Attached Submission Files */}
            <div className="trainer-form-group">
              <label className="trainer-label">Attached Submission Files ({submission.files?.length || 0}):</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {submission.files?.map((file, idx) => (
                  <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--tr-surface-alt)", border: "1px solid var(--tr-border)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "var(--tr-primary)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Input */}
            <div className="trainer-form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="trainer-label">Score / Marks (out of {submission.maxScore || 100}):</label>
                <span style={{ fontSize: "16px", fontWeight: "800", color: score >= 80 ? "#059669" : "#d97706" }}>{score} / 100</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                className="trainer-input"
              />
            </div>

            {/* Faculty Feedback Notes */}
            <div className="trainer-form-group">
              <label className="trainer-label">Faculty Feedback & Mentorship Remarks:</label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write specific feedback on data interpretation, methodology, or formatting..."
                className="trainer-textarea"
                required
              />
            </div>
          </div>

          <div className="trainer-modal-footer">
            <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="trainer-quick-btn trainer-btn-green" disabled={isSubmitting}>
              {isSubmitting ? "Publishing Grade..." : "Publish Score & Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. NEW COURSE MODAL
function NewCourseModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Satellite Remote Sensing");
  const [level, setLevel] = useState("Intermediate");
  const [durationHours, setDurationHours] = useState(20);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      title,
      category,
      level,
      durationHours: Number(durationHours),
      description,
    });
    onClose();
  };

  return (
    <div className="trainer-modal-overlay" onClick={onClose}>
      <div className="trainer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal-header">
          <h3 className="trainer-modal-title">Create New IMD Training Course</h3>
          <button className="trainer-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="trainer-modal-body">
            <div className="trainer-form-group">
              <label className="trainer-label">Course Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dual-Polarization Doppler Radar Nowcasting"
                required
                className="trainer-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="trainer-form-group">
                <label className="trainer-label">Category / Domain:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="trainer-select">
                  <option value="Satellite Remote Sensing">Satellite Remote Sensing</option>
                  <option value="Radar Meteorology">Radar Meteorology</option>
                  <option value="Numerical Weather Prediction">Numerical Weather Prediction</option>
                  <option value="Monsoon & Synoptics">Monsoon & Synoptics</option>
                  <option value="Agrometeorology & Climate">Agrometeorology & Climate</option>
                  <option value="Aviation & Cyclone Warning">Aviation & Cyclone Warning</option>
                </select>
              </div>

              <div className="trainer-form-group">
                <label className="trainer-label">Proficiency Level:</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} className="trainer-select">
                  <option value="Basic / Induction">Basic / Induction</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced Specialized">Advanced Specialized</option>
                </select>
              </div>
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Estimated Training Hours:</label>
              <input
                type="number"
                min="5"
                max="100"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="trainer-input"
              />
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Course Syllabus Summary & Objectives:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the scientific topics, software tools (e.g. Python, WRF, GrADS), and target outcomes..."
                required
                className="trainer-textarea"
              />
            </div>
          </div>
          <div className="trainer-modal-footer">
            <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="trainer-quick-btn trainer-btn-green">Publish Course</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. NEW ASSIGNMENT MODAL
function NewAssignmentModal({ courses, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "satellite-meteorology");
  const [dueDate, setDueDate] = useState("2026-03-25");
  const [maxMarks, setMaxMarks] = useState(100);
  const [weightage, setWeightage] = useState("15% of Final Grade");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      title,
      courseId,
      dueDate,
      maxMarks: Number(maxMarks),
      weightage,
      description,
    });
    onClose();
  };

  return (
    <div className="trainer-modal-overlay" onClick={onClose}>
      <div className="trainer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal-header">
          <h3 className="trainer-modal-title">Publish New Assignment</h3>
          <button className="trainer-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="trainer-modal-body">
            <div className="trainer-form-group">
              <label className="trainer-label">Assignment Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. WRF Simulation of Cyclone Biparjoy"
                required
                className="trainer-input"
              />
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Select Course:</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="trainer-select">
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="trainer-form-group">
                <label className="trainer-label">Submission Due Date:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="trainer-input"
                />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-label">Max Marks:</label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  className="trainer-input"
                />
              </div>
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Weightage:</label>
              <input
                type="text"
                value={weightage}
                onChange={(e) => setWeightage(e.target.value)}
                placeholder="e.g. 20% of Final Grade"
                className="trainer-input"
              />
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Instructions & Attached Dataset Specifications:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify NetCDF file links, coordinate boundaries, required scripts, and reporting format..."
                required
                className="trainer-textarea"
              />
            </div>
          </div>
          <div className="trainer-modal-footer">
            <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="trainer-quick-btn trainer-btn-green">Publish Assignment</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. SCHEDULE LIVE MODAL
function ScheduleLiveModal({ courses, onClose, onSchedule }) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "satellite-meteorology");
  const [batch, setBatch] = useState("All IMD Meteorologist Batches (2025-26)");
  const [date, setDate] = useState("2026-03-15");
  const [time, setTime] = useState("10:00 AM - 11:30 AM IST");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule({
      title,
      courseId,
      batch,
      date,
      time,
    });
    onClose();
  };

  return (
    <div className="trainer-modal-overlay" onClick={onClose}>
      <div className="trainer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal-header">
          <h3 className="trainer-modal-title">Schedule Live Masterclass</h3>
          <button className="trainer-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="trainer-modal-body">
            <div className="trainer-form-group">
              <label className="trainer-label">Live Session Topic:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real-Time Doppler Radar Nowcast Lab"
                required
                className="trainer-input"
              />
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Course Association:</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="trainer-select">
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Target Trainee Batch:</label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="trainer-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="trainer-form-group">
                <label className="trainer-label">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="trainer-input"
                />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-label">Time & Timezone:</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 11:30 AM IST"
                  required
                  className="trainer-input"
                />
              </div>
            </div>
          </div>
          <div className="trainer-modal-footer">
            <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="trainer-quick-btn trainer-btn-green">Schedule Masterclass</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 5. BROADCAST MODAL
function BroadcastModal({ onClose, onBroadcast }) {
  const [title, setTitle] = useState("");
  const [targetBatch, setTargetBatch] = useState("All Trainee Batches");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onBroadcast({ title, targetBatch, message });
    onClose();
  };

  return (
    <div className="trainer-modal-overlay" onClick={onClose}>
      <div className="trainer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal-header">
          <h3 className="trainer-modal-title">Broadcast Announcement to Trainees</h3>
          <button className="trainer-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="trainer-modal-body">
            <div className="trainer-form-group">
              <label className="trainer-label">Announcement Title / Subject:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. HPC Maintenance Window & Lab Reschedule"
                required
                className="trainer-input"
              />
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Target Audience / Batch:</label>
              <select value={targetBatch} onChange={(e) => setTargetBatch(e.target.value)} className="trainer-select">
                <option value="All Trainee Batches">All Trainee Batches (186 Trainees)</option>
                <option value="Satellite Meteorology Batch">Satellite Meteorology Batch (68 Trainees)</option>
                <option value="NWP & Modeling Batch">NWP & Modeling Batch (52 Trainees)</option>
                <option value="Radar Operations Batch">Radar Operations Batch (42 Trainees)</option>
              </select>
            </div>

            <div className="trainer-form-group">
              <label className="trainer-label">Broadcast Message Content:</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notice clearly. Trainees will receive an instant dashboard banner and email notification..."
                required
                className="trainer-textarea"
              />
            </div>
          </div>
          <div className="trainer-modal-footer">
            <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="trainer-quick-btn trainer-btn-green">Dispatch Broadcast</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 6. CERTIFICATE PREVIEW MODAL
function CertificatePreviewModal({ cert, onClose, onApprove }) {
  return (
    <div className="trainer-modal-overlay" onClick={onClose}>
      <div className="trainer-modal-card" style={{ maxWidth: "760px" }} onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal-header">
          <h3 className="trainer-modal-title">Official IMD Certificate Endorsement</h3>
          <button className="trainer-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="trainer-modal-body" style={{ background: "#f8faf9" }}>
          <div className="trainer-cert-paper">
            <img src="/images/sarthi-logo.png" alt="IMD Emblem" className="trainer-cert-emblem" />
            <div className="trainer-cert-title">India Meteorological Department</div>
            <div className="trainer-cert-sub">Ministry of Earth Sciences &bull; Government of India</div>

            <p style={{ fontStyle: "italic", color: "#64748b", margin: "14px 0 6px 0", fontSize: "14px" }}>
              This is to officially certify that
            </p>

            <div className="trainer-cert-name">{cert.studentName}</div>

            <p style={{ fontSize: "14px", color: "#334155", maxWidth: "560px", margin: "10px auto", lineHeight: 1.6 }}>
              has successfully completed all rigorous theoretical modules, numerical laboratory experiments, and qualifying assessments for
            </p>

            <h4 style={{ fontSize: "18px", color: "#024a3a", fontWeight: "800", margin: "12px 0" }}>
              {cert.courseTitle}
            </h4>

            <div style={{ fontSize: "13px", fontWeight: "700", color: "#059669", marginBottom: "16px" }}>
              Attained Grade: {cert.finalGrade || "96% (Grade A+)"} &bull; Certificate No: {cert.certificateNumber}
            </div>

            <div className="trainer-cert-signatures">
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "700", color: "#024a3a", fontSize: "13px" }}>Dr. R. K. Sharma</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Scientist-F & Chief Instructor, IMD</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #024a3a", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#024a3a" }}>
                  IMD SEAL
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "700", color: "#024a3a", fontSize: "13px" }}>Dr. Mrutyunjay Mohapatra</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Director General of Meteorology (DGM)</div>
              </div>
            </div>
          </div>
        </div>
        <div className="trainer-modal-footer">
          <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={onClose}>Close Preview</button>
          {cert.status === "pending_approval" && (
            <button
              type="button"
              className="trainer-quick-btn trainer-btn-green"
              onClick={() => {
                onApprove(cert.id);
                onClose();
              }}
            >
              Sign & Endorse Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 7. TRAINEE DOSSIER MODAL
function TraineeDossierModal({ trainee, onClose }) {
  return (
    <div className="trainer-modal-overlay" onClick={onClose}>
      <div className="trainer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trainer-modal-header">
          <h3 className="trainer-modal-title">Trainee Academic Dossier</h3>
          <button className="trainer-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="trainer-modal-body">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "var(--tr-surface-alt)", borderRadius: "var(--tr-radius-md)" }}>
            <img src={trainee.avatar || "/images/student-img-1.jpg"} alt={trainee.name} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--tr-accent-teal)" }} />
            <div>
              <h4 style={{ margin: 0, fontSize: "18px", color: "var(--tr-text-heading)", fontWeight: "800" }}>{trainee.name}</h4>
              <div style={{ fontSize: "13px", color: "var(--tr-text-muted)", marginTop: "2px" }}>{trainee.division}</div>
              <div style={{ fontSize: "12px", color: "var(--tr-text-light)", marginTop: "2px" }}>{trainee.email} &bull; {trainee.batch}</div>
            </div>
            <span className="trainer-status-tag tag-graded" style={{ marginLeft: "auto" }}>
              {trainee.performanceTier}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#ffffff", border: "1px solid var(--tr-border)", borderRadius: "var(--tr-radius-md)", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#059669" }}>{trainee.attendanceRate}%</div>
              <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>Live Attendance</div>
            </div>
            <div style={{ padding: "12px", background: "#ffffff", border: "1px solid var(--tr-border)", borderRadius: "var(--tr-radius-md)", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#0d9488" }}>{trainee.quizAvgScore}%</div>
              <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>Quiz Average</div>
            </div>
            <div style={{ padding: "12px", background: "#ffffff", border: "1px solid var(--tr-border)", borderRadius: "var(--tr-radius-md)", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#4f46e5" }}>{trainee.assignmentsSubmitted}</div>
              <div style={{ fontSize: "11.5px", color: "var(--tr-text-muted)" }}>Submissions Done</div>
            </div>
          </div>

          <div className="trainer-form-group">
            <label className="trainer-label">Faculty Confidential Notes:</label>
            <div style={{ padding: "12px", background: "var(--tr-surface-alt)", borderRadius: "var(--tr-radius-md)", fontSize: "13px", color: "#334155" }}>
              {trainee.notes || "No special notes logged."}
            </div>
          </div>
        </div>
        <div className="trainer-modal-footer">
          <button type="button" className="trainer-quick-btn trainer-btn-outline" onClick={onClose}>Close Dossier</button>
        </div>
      </div>
    </div>
  );
}
