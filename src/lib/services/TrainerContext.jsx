"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialTrainerProfile,
  initialTrainerCourses,
  initialTrainees,
  initialTrainerAssignments,
  initialSubmissionsQueue,
  initialTrainerLiveClasses,
  initialTrainerQuizzes,
  initialTrainerCertificates,
  initialTrainerConversations,
  initialBroadcasts,
} from "./trainerData";

const TrainerContext = createContext(null);

export function TrainerProvider({ children }) {
  const [trainer, setTrainer] = useState(initialTrainerProfile);
  const [courses, setCourses] = useState(initialTrainerCourses);
  const [trainees, setTrainees] = useState(initialTrainees);
  const [assignments, setAssignments] = useState(initialTrainerAssignments);
  const [submissions, setSubmissions] = useState(initialSubmissionsQueue);
  const [liveClasses, setLiveClasses] = useState(initialTrainerLiveClasses);
  const [quizzes, setQuizzes] = useState(initialTrainerQuizzes);
  const [certificates, setCertificates] = useState(initialTrainerCertificates);
  const [conversations, setConversations] = useState(initialTrainerConversations);
  const [broadcasts, setBroadcasts] = useState(initialBroadcasts);

  // Active Global Modal State
  const [activeModal, setActiveModal] = useState(null); // { type: 'grading'|'new_course'|'new_assignment'|'schedule_live'|'broadcast'|'certificate_preview'|'trainee_dossier', data: any }

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedTrainer = localStorage.getItem("sarthi_trainer_profile");
      if (savedTrainer) setTrainer(JSON.parse(savedTrainer));

      const savedCourses = localStorage.getItem("sarthi_trainer_courses");
      if (savedCourses) setCourses(JSON.parse(savedCourses));

      const savedTrainees = localStorage.getItem("sarthi_trainer_trainees");
      if (savedTrainees) setTrainees(JSON.parse(savedTrainees));

      const savedAssignments = localStorage.getItem("sarthi_trainer_assignments");
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

      const savedSubmissions = localStorage.getItem("sarthi_trainer_submissions");
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));

      const savedLive = localStorage.getItem("sarthi_trainer_live");
      if (savedLive) setLiveClasses(JSON.parse(savedLive));

      const savedQuizzes = localStorage.getItem("sarthi_trainer_quizzes");
      if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));

      const savedCerts = localStorage.getItem("sarthi_trainer_certs");
      if (savedCerts) setCertificates(JSON.parse(savedCerts));

      const savedConvs = localStorage.getItem("sarthi_trainer_convs");
      if (savedConvs) setConversations(JSON.parse(savedConvs));

      const savedBcasts = localStorage.getItem("sarthi_trainer_bcasts");
      if (savedBcasts) setBroadcasts(JSON.parse(savedBcasts));
    } catch (e) {
      console.warn("Trainer storage read error:", e);
    }
  }, []);

  // Persistence helpers
  const saveTrainer = (data) => {
    setTrainer(data);
    try { localStorage.setItem("sarthi_trainer_profile", JSON.stringify(data)); } catch (e) {}
  };

  const saveCourses = (data) => {
    setCourses(data);
    try { localStorage.setItem("sarthi_trainer_courses", JSON.stringify(data)); } catch (e) {}
  };

  const saveTrainees = (data) => {
    setTrainees(data);
    try { localStorage.setItem("sarthi_trainer_trainees", JSON.stringify(data)); } catch (e) {}
  };

  const saveAssignments = (data) => {
    setAssignments(data);
    try { localStorage.setItem("sarthi_trainer_assignments", JSON.stringify(data)); } catch (e) {}
  };

  const saveSubmissions = (data) => {
    setSubmissions(data);
    try { localStorage.setItem("sarthi_trainer_submissions", JSON.stringify(data)); } catch (e) {}
  };

  const saveLiveClasses = (data) => {
    setLiveClasses(data);
    try { localStorage.setItem("sarthi_trainer_live", JSON.stringify(data)); } catch (e) {}
  };

  const saveQuizzes = (data) => {
    setQuizzes(data);
    try { localStorage.setItem("sarthi_trainer_quizzes", JSON.stringify(data)); } catch (e) {}
  };

  const saveCertificates = (data) => {
    setCertificates(data);
    try { localStorage.setItem("sarthi_trainer_certs", JSON.stringify(data)); } catch (e) {}
  };

  const saveConversations = (data) => {
    setConversations(data);
    try { localStorage.setItem("sarthi_trainer_convs", JSON.stringify(data)); } catch (e) {}
  };

  const saveBroadcasts = (data) => {
    setBroadcasts(data);
    try { localStorage.setItem("sarthi_trainer_bcasts", JSON.stringify(data)); } catch (e) {}
  };

  // Actions: Grading Submissions
  const gradeSubmission = (submissionId, { score, feedback = "" }) => {
    const numericScore = Number(score);
    const now = new Date().toISOString();
    const updated = submissions.map((sub) => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: "graded",
          score: numericScore,
          feedback: feedback || "Evaluated by Dr. R. K. Sharma. Satisfies all IMD standard criteria.",
          gradedAt: now,
        };
      }
      return sub;
    });
    saveSubmissions(updated);

    // Update pending count in trainer profile
    const pendingCount = updated.filter((s) => s.status === "pending").length;
    saveTrainer({
      ...trainer,
      pendingEvaluationsCount: pendingCount,
    });
    return true;
  };

  // Actions: Course Management
  const addCourse = (newCourse) => {
    const courseObj = {
      id: `course-${Date.now()}`,
      slug: newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: newCourse.title,
      category: newCourse.category || "Meteorology",
      level: newCourse.level || "Intermediate",
      status: "active",
      enrolledCount: 0,
      completionRate: 0,
      totalModules: newCourse.modules?.length || 1,
      totalLessons: newCourse.totalLessons || 12,
      durationHours: newCourse.durationHours || 15,
      thumbnail: newCourse.thumbnail || "/images/satellite-meteorology-thumb.jpg",
      lastUpdated: new Date().toISOString().split("T")[0],
      nextLiveClass: "TBD",
      description: newCourse.description || "Course designed for IMD officers and meteorological trainees.",
      modules: newCourse.modules || [
        {
          id: `mod-${Date.now()}`,
          title: "Module 1: Fundamental Concepts & Observational Principles",
          lessonsCount: 4,
          duration: "2h 30m",
          status: "active",
          lessons: [
            { id: `les-${Date.now()}-1`, title: "1. Overview & Theoretical Baseline", duration: "30m", type: "video" },
            { id: `les-${Date.now()}-2`, title: "2. Practical NetCDF Dataset Lab", duration: "45m", type: "lab" },
          ],
        },
      ],
    };
    const updated = [courseObj, ...courses];
    saveCourses(updated);
    saveTrainer({
      ...trainer,
      activeCoursesCount: updated.filter((c) => c.status === "active").length,
    });
    return courseObj;
  };

  const toggleCourseStatus = (courseId) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          status: c.status === "active" ? "draft" : "active",
        };
      }
      return c;
    });
    saveCourses(updated);
    saveTrainer({
      ...trainer,
      activeCoursesCount: updated.filter((c) => c.status === "active").length,
    });
  };

  // Actions: Assignment Creation
  const createAssignment = (data) => {
    const newAsg = {
      id: `asg-trainer-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseTitle: courses.find((c) => c.id === data.courseId)?.title || "IMD Meteorology Course",
      dueDate: data.dueDate || "2026-03-31",
      maxMarks: Number(data.maxMarks) || 100,
      weightage: data.weightage || "15% of Final Grade",
      status: "active",
      totalSubmissions: 0,
      gradedCount: 0,
      pendingCount: 0,
      rubric: data.rubric || [
        { criterion: "Scientific Accuracy & Methodology", marks: 40 },
        { criterion: "Data Analysis & Plotting", marks: 35 },
        { criterion: "Summary & Synthesis", marks: 25 },
      ],
      description: data.description || "Complete the assigned meteorological analysis following IMD protocols.",
    };
    const updated = [newAsg, ...assignments];
    saveAssignments(updated);
    return newAsg;
  };

  // Actions: Live Classes
  const scheduleLiveClass = (data) => {
    const d = new Date(data.date || "2026-03-15");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const newLive = {
      id: `live-session-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseName: courses.find((c) => c.id === data.courseId)?.title || "Specialized Meteorological Session",
      batch: data.batch || "All IMD Probationers",
      date: data.date,
      day: String(d.getDate()).padStart(2, "0"),
      month: months[d.getMonth()] || "MAR",
      time: data.time || "10:00 AM - 11:30 AM IST",
      status: "upcoming",
      registeredCount: 45,
      attendedCount: 0,
      meetingUrl: `https://meet.imd.gov.in/live-${Date.now().toString().slice(-4)}`,
      passcode: "IMD-TRAINER-2026",
      agenda: data.agenda || ["Introduction and theoretical framing", "Interactive radar/satellite live walk-through", "Q&A and student assessments"],
      materials: ["masterclass_handout.pdf"],
    };
    const updated = [newLive, ...liveClasses];
    saveLiveClasses(updated);
    return newLive;
  };

  // Actions: Quizzes
  const createQuiz = (data) => {
    const newQuiz = {
      id: `quiz-trainer-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseTitle: courses.find((c) => c.id === data.courseId)?.title || "Meteorology Assessment",
      timeLimitMinutes: Number(data.timeLimitMinutes) || 20,
      totalQuestions: data.questions?.length || 3,
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
      status: "published",
      questions: data.questions || [
        {
          id: `q-${Date.now()}-1`,
          question: "Which satellite channel is best for detecting low-level atmospheric moisture?",
          options: ["Visible 0.65µm", "Thermal IR 10.8µm", "Water Vapor 6.7µm", "Shortwave IR 3.9µm"],
          correctOptionIndex: 2,
          explanation: "Water vapor absorption band at 6.7µm reflects atmospheric moisture dynamics.",
          difficulty: "Medium",
        },
      ],
    };
    const updated = [newQuiz, ...quizzes];
    saveQuizzes(updated);
    return newQuiz;
  };

  // Actions: Certificates
  const approveCertificate = (certId) => {
    const updated = certificates.map((c) =>
      c.id === certId
        ? { ...c, status: "approved", approvedAt: new Date().toISOString() }
        : c
    );
    saveCertificates(updated);
  };

  const batchApproveCertificates = () => {
    const updated = certificates.map((c) => ({
      ...c,
      status: "approved",
      approvedAt: new Date().toISOString(),
    }));
    saveCertificates(updated);
  };

  // Actions: Messages & Broadcasts
  const sendReplyToConversation = (convId, text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const updated = conversations.map((c) => {
      if (c.id === convId) {
        return {
          ...c,
          unreadCount: 0,
          lastMessage: {
            text,
            timestamp: "Just now",
            sender: "trainer",
          },
          messages: [
            ...c.messages,
            {
              id: `msg-${Date.now()}`,
              sender: "trainer",
              text,
              timestamp: timeStr,
            },
          ],
        };
      }
      return c;
    });
    saveConversations(updated);
  };

  const sendBroadcast = ({ title, targetBatch, message }) => {
    const now = new Date();
    const dateStr = now.toISOString().replace("T", " ").slice(0, 16) + " IST";
    const newBcast = {
      id: `bcast-${Date.now()}`,
      title,
      targetBatch: targetBatch || "All Trainee Batches",
      sentAt: dateStr,
      message,
      recipientCount: 186,
    };
    const updated = [newBcast, ...broadcasts];
    saveBroadcasts(updated);
    return newBcast;
  };

  const updateTrainerProfile = (data) => {
    const updated = { ...trainer, ...data };
    saveTrainer(updated);
  };

  const value = {
    trainer,
    courses,
    trainees,
    assignments,
    submissions,
    liveClasses,
    quizzes,
    certificates,
    conversations,
    broadcasts,
    activeModal,
    setActiveModal,
    gradeSubmission,
    addCourse,
    toggleCourseStatus,
    createAssignment,
    scheduleLiveClass,
    createQuiz,
    approveCertificate,
    batchApproveCertificates,
    sendReplyToConversation,
    sendBroadcast,
    updateTrainerProfile,
  };

  return (
    <TrainerContext.Provider value={value}>
      {children}
    </TrainerContext.Provider>
  );
}

export function useTrainer() {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error("useTrainer must be used within a TrainerProvider");
  }
  return context;
}
