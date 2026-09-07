"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  const [navCounts, setNavCounts] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Active Global Modal State
  // { type: 'new_course' | 'schedule_live' | 'grade_submission' | 'broadcast' | null, data: any }
  const [activeModal, setActiveModal] = useState(null);

  // Persistence helpers
  const saveTrainer = useCallback((data) => {
    setTrainer(data);
    try { localStorage.setItem("sarthi_trainer_profile", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveCourses = useCallback((data) => {
    setCourses(data);
    try { localStorage.setItem("sarthi_trainer_courses", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveTrainees = useCallback((data) => {
    setTrainees(data);
    try { localStorage.setItem("sarthi_trainer_trainees", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveAssignments = useCallback((data) => {
    setAssignments(data);
    try { localStorage.setItem("sarthi_trainer_assignments", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveSubmissions = useCallback((data) => {
    setSubmissions(data);
    try { localStorage.setItem("sarthi_trainer_submissions", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveLiveClasses = useCallback((data) => {
    setLiveClasses(data);
    try { localStorage.setItem("sarthi_trainer_live", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveQuizzes = useCallback((data) => {
    setQuizzes(data);
    try { localStorage.setItem("sarthi_trainer_quizzes", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveCertificates = useCallback((data) => {
    setCertificates(data);
    try { localStorage.setItem("sarthi_trainer_certs", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveConversations = useCallback((data) => {
    setConversations(data);
    try { localStorage.setItem("sarthi_trainer_convs", JSON.stringify(data)); } catch (e) {}
  }, []);

  const saveBroadcasts = useCallback((data) => {
    setBroadcasts(data);
    try { localStorage.setItem("sarthi_trainer_bcasts", JSON.stringify(data)); } catch (e) {}
  }, []);

  // Fetch live state from backend API routes
  const refreshBackendData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [
        dashRes,
        coursesRes,
        asgRes,
        subRes,
        liveRes,
        studentsRes,
        navRes,
        annRes,
      ] = await Promise.allSettled([
        fetch("/api/teacher/dashboard").then((r) => r.json()),
        fetch("/api/teacher/courses").then((r) => r.json()),
        fetch("/api/teacher/assignments").then((r) => r.json()),
        fetch("/api/teacher/submissions").then((r) => r.json()),
        fetch("/api/teacher/live-classes").then((r) => r.json()),
        fetch("/api/teacher/students").then((r) => r.json()),
        fetch("/api/teacher/nav-counts").then((r) => r.json()),
        fetch("/api/teacher/announcements").then((r) => r.json()),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.success && dashRes.value.data?.teacher) {
        saveTrainer(dashRes.value.data.teacher);
      }

      if (coursesRes.status === "fulfilled" && coursesRes.value?.success && coursesRes.value.data?.courses) {
        saveCourses(coursesRes.value.data.courses);
      }

      if (asgRes.status === "fulfilled" && asgRes.value?.success && asgRes.value.data?.assignments) {
        saveAssignments(asgRes.value.data.assignments);
      }

      if (subRes.status === "fulfilled" && subRes.value?.success && subRes.value.data?.submissions) {
        saveSubmissions(subRes.value.data.submissions);
      }

      if (liveRes.status === "fulfilled" && liveRes.value?.success && liveRes.value.data?.liveClasses) {
        saveLiveClasses(liveRes.value.data.liveClasses);
      }

      if (studentsRes.status === "fulfilled" && studentsRes.value?.success && studentsRes.value.data?.students) {
        saveTrainees(studentsRes.value.data.students);
      }

      if (navRes.status === "fulfilled" && navRes.value?.success && navRes.value.data) {
        setNavCounts(navRes.value.data);
      }

      if (annRes.status === "fulfilled" && annRes.value?.success && Array.isArray(annRes.value.data)) {
        saveBroadcasts(annRes.value.data);
      }
    } catch (err) {
      console.warn("Trainer API sync warning:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [saveTrainer, saveCourses, saveAssignments, saveSubmissions, saveLiveClasses, saveTrainees, saveBroadcasts]);

  // Load initial state: localStorage first, then sync with live backend
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

    refreshBackendData();
  }, [refreshBackendData]);

  // Actions: Grading Submissions
  const gradeSubmission = async (submissionId, { score, feedback = "" }) => {
    const numericScore = Number(score);
    const now = new Date().toISOString();
    
    // Optimistic local update
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

    const pendingCount = updated.filter((s) => s.status === "pending").length;
    saveTrainer({
      ...trainer,
      pendingEvaluationsCount: pendingCount,
    });

    // Call backend API
    try {
      await fetch(`/api/teacher/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: numericScore, feedback }),
      });
      // Refresh counts
      fetch("/api/teacher/nav-counts").then((r) => r.json()).then((res) => {
        if (res.success && res.data) setNavCounts(res.data);
      }).catch(() => {});
    } catch (err) {
      console.warn("Backend grade sync error:", err);
    }

    return true;
  };

  // Actions: Course Management
  const addCourse = async (newCourse) => {
    const tempId = `course-${Date.now()}`;
    const courseObj = {
      id: tempId,
      slug: (newCourse.title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: newCourse.title,
      category: newCourse.category || "Meteorology",
      level: newCourse.level || "Intermediate",
      status: newCourse.isPublished ? "active" : "draft",
      isPublished: Boolean(newCourse.isPublished),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    const updated = [courseObj, ...courses];
    saveCourses(updated);
    saveTrainer({
      ...trainer,
      activeCoursesCount: updated.filter((c) => c.status === "active").length,
    });

    // Call backend API
    try {
      const res = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const synced = updated.map((c) => (c.id === tempId ? data.data : c));
        saveCourses(synced);
      }
    } catch (err) {
      console.warn("Backend course creation sync warning:", err);
    }

    return courseObj;
  };

  const toggleCourseStatus = async (courseId) => {
    // Optimistic toggle
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const nextStatus = c.status === "active" ? "draft" : "active";
        return {
          ...c,
          status: nextStatus,
          isPublished: nextStatus === "active",
        };
      }
      return c;
    });
    saveCourses(updated);
    saveTrainer({
      ...trainer,
      activeCoursesCount: updated.filter((c) => c.status === "active").length,
    });

    // Call backend API
    try {
      await fetch(`/api/teacher/courses/${courseId}/publish`, {
        method: "POST",
      });
    } catch (err) {
      console.warn("Backend course toggle warning:", err);
    }
  };

  // Actions: Assignment Creation
  const createAssignment = async (data) => {
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

    try {
      await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Backend assignment sync warning:", err);
    }

    return newAsg;
  };

  // Actions: Live Classes
  const scheduleLiveClass = async (data) => {
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

    try {
      await fetch("/api/teacher/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Backend live-class sync warning:", err);
    }

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
  const sendReplyToConversation = async (convId, text) => {
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

    try {
      await fetch("/api/teacher/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, text }),
      });
    } catch (err) {
      console.warn("Backend message sync warning:", err);
    }
  };

  const sendBroadcast = async ({ title, targetBatch, message }) => {
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

    try {
      await fetch("/api/teacher/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, targetBatch, message }),
      });
    } catch (err) {
      console.warn("Backend announcement sync warning:", err);
    }

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
    navCounts,
    isSyncing,
    activeModal,
    setActiveModal,
    refreshBackendData,
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
