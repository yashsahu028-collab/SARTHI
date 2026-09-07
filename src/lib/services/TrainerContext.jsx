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
        quizRes,
        msgRes,
      ] = await Promise.allSettled([
        fetch("/api/teacher/dashboard").then((r) => r.json()),
        fetch("/api/teacher/courses").then((r) => r.json()),
        fetch("/api/teacher/assignments").then((r) => r.json()),
        fetch("/api/teacher/submissions").then((r) => r.json()),
        fetch("/api/teacher/live").then((r) => r.json()),
        fetch("/api/teacher/students").then((r) => r.json()),
        fetch("/api/teacher/nav-counts").then((r) => r.json()),
        fetch("/api/teacher/announcements").then((r) => r.json()),
        fetch("/api/teacher/quizzes").then((r) => r.json()),
        fetch("/api/teacher/messages").then((r) => r.json()),
      ]);

      // 1. Dashboard & Profile
      if (dashRes.status === "fulfilled" && dashRes.value?.success && dashRes.value.data?.teacher) {
        saveTrainer(dashRes.value.data.teacher);
      }

      // 2. Courses with normalized fields for Trainer UI
      if (coursesRes.status === "fulfilled" && coursesRes.value?.success && coursesRes.value.data?.courses) {
        const rawCourses = coursesRes.value.data.courses;
        const normalizedCourses = rawCourses.map((c) => ({
          ...c,
          id: c.id,
          title: c.title,
          category: c.category || "Technology & Analytics",
          level: c.level || "Intermediate",
          status: (c.status === "published" || c.isPublished || c.status === "active") ? "active" : "draft",
          isPublished: Boolean(c.isPublished || c.status === "published" || c.status === "active"),
          enrolledCount: c.studentsEnrolled ?? c.enrolledCount ?? 84,
          totalLessons: c.totalVideos ?? c.totalLessons ?? 12,
          totalModules: c.totalModules ?? (c.modules ? c.modules.length : 4),
          durationHours: c.durationHours ?? 18,
          completionRate: c.completionRate ?? 82,
          thumbnail: c.thumbnail || "/images/satellite-meteorology-thumb.jpg",
          description: c.description || "Course curriculum and practical laboratory masterclasses.",
          modules: c.modules || []
        }));
        if (normalizedCourses.length > 0) {
          saveCourses(normalizedCourses);
        }
      }

      // 3. Assignments
      if (asgRes.status === "fulfilled" && asgRes.value?.success && asgRes.value.data?.assignments) {
        const rawAsgs = asgRes.value.data.assignments;
        if (Array.isArray(rawAsgs) && rawAsgs.length > 0) {
          const normalizedAsgs = rawAsgs.map((a) => ({
            ...a,
            id: a.id,
            title: a.title,
            courseId: a.courseId || a.course?.id,
            courseTitle: a.courseTitle || a.course?.title || "Advanced Course",
            dueDate: a.dueDate || a.dueAt || "2026-03-31",
            maxMarks: a.maxScore || a.maxMarks || 100,
            weightage: a.weightage || "15% of Final Grade",
            status: a.status?.toLowerCase() === "released" ? "active" : (a.status?.toLowerCase() || "active"),
            totalSubmissions: a.attemptCount || 0,
            gradedCount: 0,
            pendingCount: 0,
          }));
          saveAssignments(normalizedAsgs);
        }
      }

      // 4. Submissions Desk
      if (subRes.status === "fulfilled" && subRes.value?.success && subRes.value.data?.submissions) {
        const rawSubs = subRes.value.data.submissions;
        if (Array.isArray(rawSubs) && rawSubs.length > 0) {
          const normalizedSubs = rawSubs.map((s) => ({
            ...s,
            id: s.id,
            studentName: s.studentName || s.student?.name || "Enrolled Trainee",
            studentEmail: s.studentEmail || s.student?.email || "",
            studentAvatar: s.studentAvatar || s.student?.image || "/images/student-img-1.jpg",
            division: s.division || "Advanced Technology Division",
            assignmentId: s.assignmentId || s.assignment?.id,
            assignmentTitle: s.assignmentTitle || s.assignment?.title || "Practical Lab",
            courseId: s.courseId || s.assignment?.courseId,
            courseTitle: s.courseTitle || s.assignment?.courseTitle || "Course Practical",
            status: s.status?.toLowerCase() === "graded" ? "graded" : "pending",
            score: s.score,
            maxScore: s.maxScore || 100,
            feedback: s.feedback || "",
            submittedAt: s.submittedAt || new Date().toISOString(),
            fileUrl: s.fileUrl || null,
          }));
          saveSubmissions(normalizedSubs);
        }
      }

      // 5. Live Classes
      if (liveRes.status === "fulfilled" && liveRes.value?.success && (liveRes.value.data?.liveClasses || liveRes.value.liveClasses)) {
        const rawLive = liveRes.value.data?.liveClasses || liveRes.value.liveClasses;
        if (Array.isArray(rawLive) && rawLive.length > 0) {
          const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          const normalizedLive = rawLive.map((l) => {
            const d = l.scheduledAt ? new Date(l.scheduledAt) : (l.createdAt ? new Date(l.createdAt) : new Date());
            return {
              ...l,
              id: l.id,
              title: l.title,
              courseId: l.courseId,
              courseName: l.course?.title || "Live Masterclass Session",
              status: l.status?.toLowerCase() || "upcoming",
              day: String(d.getDate()).padStart(2, "0"),
              month: months[d.getMonth()] || "SEP",
              time: l.scheduledAt ? new Date(l.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "10:00 AM IST",
              registeredCount: 84,
              meetingUrl: l.roomName ? `/live-class/${l.id}` : `https://meet.sarthi.gov.in/live-${l.id.slice(-4)}`,
            };
          });
          saveLiveClasses(normalizedLive);
        }
      }

      // 6. Trainees & Students
      if (studentsRes.status === "fulfilled" && studentsRes.value?.success && studentsRes.value.data?.students) {
        const rawStudents = studentsRes.value.data.students;
        if (Array.isArray(rawStudents) && rawStudents.length > 0) {
          const normalized = rawStudents.map((s) => ({
            ...s,
            id: s.id,
            name: s.name || s.student?.name || "Enrolled Student",
            email: s.email || s.student?.email || "student@sarthi.gov.in",
            avatar: s.avatar || s.student?.image || "/images/student-img-1.jpg",
            division: s.division || s.course?.title || "Advanced Technology Division",
            cohort: s.cohort || "Probationary Cohort 2026",
            attendance: s.attendance ?? (s.progress > 0 ? s.progress : 94),
            quizAverage: s.quizAverage ?? (s.progress > 0 ? s.progress : 90),
            assignmentsCompleted: s.assignmentsCompleted ?? (s.progress === 100 ? 5 : 3),
            totalAssignments: s.totalAssignments ?? 5,
            performanceTier: s.performanceTier || (s.progress >= 80 ? "Exemplary" : s.status === "struggling" ? "Needs Attention" : "On Track"),
          }));
          saveTrainees(normalized);
        }
      }

      // 7. Navigation Counts
      if (navRes.status === "fulfilled" && navRes.value?.success && navRes.value.data) {
        setNavCounts(navRes.value.data);
      }

      // 8. Announcements & Broadcasts
      if (annRes.status === "fulfilled" && annRes.value?.success) {
        const annList = annRes.value.data?.announcements || (Array.isArray(annRes.value.data) ? annRes.value.data : []);
        if (Array.isArray(annList) && annList.length > 0) {
          saveBroadcasts(annList);
        }
      }

      // 9. Quizzes
      if (quizRes.status === "fulfilled" && quizRes.value?.success && quizRes.value.data?.quizzes) {
        const rawQuizzes = quizRes.value.data.quizzes;
        if (Array.isArray(rawQuizzes) && rawQuizzes.length > 0) {
          saveQuizzes(rawQuizzes);
        }
      }

      // 10. Messages & Conversations
      if (msgRes.status === "fulfilled" && msgRes.value?.success && msgRes.value.data?.conversations) {
        const rawConvs = msgRes.value.data.conversations;
        if (Array.isArray(rawConvs) && rawConvs.length > 0) {
          saveConversations(rawConvs);
        }
      }
    } catch (err) {
      console.warn("Trainer API sync warning:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [saveTrainer, saveCourses, saveAssignments, saveSubmissions, saveLiveClasses, saveTrainees, saveBroadcasts, saveQuizzes, saveConversations]);

  // Load initial state: localStorage first, then sync with live backend
  useEffect(() => {
    try {
      const savedTrainer = localStorage.getItem("sarthi_trainer_profile");
      if (savedTrainer) {
        const parsed = JSON.parse(savedTrainer);
        if (parsed?.name === "Dr. R. K. Sharma" || parsed?.id === "trainer-rk-sharma") {
          localStorage.removeItem("sarthi_trainer_profile");
        } else {
          setTrainer(parsed);
        }
      }

      const savedCourses = localStorage.getItem("sarthi_trainer_courses");
      if (savedCourses) {
        const parsed = JSON.parse(savedCourses);
        if (Array.isArray(parsed) && parsed.some((c) => c.id === "satellite-meteorology" || c.slug === "satellite-meteorology")) {
          localStorage.removeItem("sarthi_trainer_courses");
        } else {
          setCourses(parsed);
        }
      }

      const savedTrainees = localStorage.getItem("sarthi_trainer_trainees");
      if (savedTrainees) {
        const parsed = JSON.parse(savedTrainees);
        if (Array.isArray(parsed) && parsed.some((t) => t.name === "Arjun Verma" || t.id === "tr-1")) {
          localStorage.removeItem("sarthi_trainer_trainees");
        } else {
          setTrainees(parsed);
        }
      }

      const savedAssignments = localStorage.getItem("sarthi_trainer_assignments");
      if (savedAssignments) {
        const parsed = JSON.parse(savedAssignments);
        if (Array.isArray(parsed) && parsed.some((a) => a.id === "asg-1")) {
          localStorage.removeItem("sarthi_trainer_assignments");
        } else {
          setAssignments(parsed);
        }
      }

      const savedSubmissions = localStorage.getItem("sarthi_trainer_submissions");
      if (savedSubmissions) {
        const parsed = JSON.parse(savedSubmissions);
        if (Array.isArray(parsed) && parsed.some((s) => s.id === "sub-1")) {
          localStorage.removeItem("sarthi_trainer_submissions");
        } else {
          setSubmissions(parsed);
        }
      }

      const savedLive = localStorage.getItem("sarthi_trainer_live");
      if (savedLive) {
        const parsed = JSON.parse(savedLive);
        if (Array.isArray(parsed) && parsed.some((l) => l.id === "live-1")) {
          localStorage.removeItem("sarthi_trainer_live");
        } else {
          setLiveClasses(parsed);
        }
      }

      const savedQuizzes = localStorage.getItem("sarthi_trainer_quizzes");
      if (savedQuizzes) {
        const parsed = JSON.parse(savedQuizzes);
        if (Array.isArray(parsed) && parsed.some((q) => q.id === "quiz-1")) {
          localStorage.removeItem("sarthi_trainer_quizzes");
        } else {
          setQuizzes(parsed);
        }
      }

      const savedCerts = localStorage.getItem("sarthi_trainer_certs");
      if (savedCerts) setCertificates(JSON.parse(savedCerts));

      const savedConvs = localStorage.getItem("sarthi_trainer_convs");
      if (savedConvs) {
        const parsed = JSON.parse(savedConvs);
        if (Array.isArray(parsed) && parsed.some((c) => c.id === "conv-t-1")) {
          localStorage.removeItem("sarthi_trainer_convs");
        } else {
          setConversations(parsed);
        }
      }

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
    const d = new Date(data.date || new Date());
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const newLive = {
      id: `live-session-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseName: courses.find((c) => c.id === data.courseId)?.title || "Specialized Meteorological Session",
      batch: data.batch || "All Trainee Batches",
      date: data.date,
      day: String(d.getDate()).padStart(2, "0"),
      month: months[d.getMonth()] || "SEP",
      time: data.time || "10:00 AM - 11:30 AM IST",
      status: "upcoming",
      registeredCount: 45,
      attendedCount: 0,
      meetingUrl: `https://meet.sarthi.gov.in/live-${Date.now().toString().slice(-4)}`,
      passcode: "SARTHI-FACULTY-2026",
      agenda: data.agenda || ["Introduction and theoretical framing", "Interactive analysis lab", "Q&A and assessments"],
      materials: ["masterclass_handout.pdf"],
    };

    const updated = [newLive, ...liveClasses];
    saveLiveClasses(updated);

    try {
      await fetch("/api/teacher/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description || "Live Interactive Masterclass",
          courseId: data.courseId,
          scheduledAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn("Backend live-class sync warning:", err);
    }

    return newLive;
  };

  // Actions: Quizzes
  const createQuiz = async (data) => {
    const newQuiz = {
      id: `quiz-trainer-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseTitle: courses.find((c) => c.id === data.courseId)?.title || "Meteorology Assessment",
      timeLimitMinutes: Number(data.timeLimitMinutes) || 20,
      totalQuestions: data.questions?.length || 4,
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

    try {
      await fetch("/api/teacher/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Backend quiz sync warning:", err);
    }

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

  const updateTrainerProfile = async (data) => {
    const updated = { ...trainer, ...data };
    saveTrainer(updated);

    try {
      await fetch("/api/teacher/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Backend profile sync error:", err);
    }
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
