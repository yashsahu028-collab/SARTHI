"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  initialStudentProfile,
  initialCourses,
  initialLiveClasses,
  initialAssignments,
  initialQuizzes,
  initialCertificates,
  initialConversations,
  initialSettings,
} from "./studentData";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(initialStudentProfile);
  const [courses, setCourses] = useState(initialCourses);
  const [liveClasses, setLiveClasses] = useState(initialLiveClasses);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [conversations, setConversations] = useState(initialConversations);
  const [settings, setSettings] = useState(initialSettings);
  const [activeLiveModal, setActiveLiveModal] = useState(null);
  const [navCounts, setNavCounts] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Persistence helpers
  const saveAssignments = useCallback((newAssignments) => {
    setAssignments(newAssignments);
    try {
      localStorage.setItem("sarthi_assignments", JSON.stringify(newAssignments));
    } catch (e) {}
  }, []);

  const saveQuizzes = useCallback((newQuizzes) => {
    setQuizzes(newQuizzes);
    try {
      localStorage.setItem("sarthi_quizzes", JSON.stringify(newQuizzes));
    } catch (e) {}
  }, []);

  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    if (newSettings.name) {
      setStudent((prev) => ({ ...prev, name: newSettings.name }));
    }
    try {
      localStorage.setItem("sarthi_settings", JSON.stringify(newSettings));
    } catch (e) {}
  }, []);

  const saveCourses = useCallback((newCourses) => {
    setCourses(newCourses);
    try {
      localStorage.setItem("sarthi_courses", JSON.stringify(newCourses));
    } catch (e) {}
  }, []);

  const saveConversations = useCallback((newConvs) => {
    setConversations(newConvs);
    try {
      localStorage.setItem("sarthi_conversations", JSON.stringify(newConvs));
    } catch (e) {}
  }, []);

  // Fetch live state from student backend API routes
  const refreshBackendData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [
        dashRes,
        coursesRes,
        asgRes,
        liveRes,
        quizzesRes,
        certsRes,
        navRes,
      ] = await Promise.allSettled([
        fetch("/api/student/dashboard").then((r) => r.json()),
        fetch("/api/student/courses").then((r) => r.json()),
        fetch("/api/student/assignments").then((r) => r.json()),
        fetch("/api/student/live").then((r) => r.json()),
        fetch("/api/student/quizzes").then((r) => r.json()),
        fetch("/api/student/certificates").then((r) => r.json()),
        fetch("/api/student/nav-counts").then((r) => r.json()),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.success && dashRes.value.data?.student) {
        setStudent((prev) => ({
          ...prev,
          ...dashRes.value.data.student,
        }));
      }

      if (coursesRes.status === "fulfilled" && coursesRes.value?.success && coursesRes.value.data?.courses) {
        saveCourses(coursesRes.value.data.courses);
      }

      if (asgRes.status === "fulfilled" && asgRes.value?.success && asgRes.value.data?.assignments) {
        saveAssignments(asgRes.value.data.assignments);
      }

      if (liveRes.status === "fulfilled" && liveRes.value?.success && liveRes.value.data?.liveClasses) {
        setLiveClasses(liveRes.value.data.liveClasses);
      }

      if (quizzesRes.status === "fulfilled" && quizzesRes.value?.success && quizzesRes.value.data?.quizzes) {
        saveQuizzes(quizzesRes.value.data.quizzes);
      }

      const certsList = certsRes.status === "fulfilled" 
        ? (certsRes.value?.certificates || certsRes.value?.data?.certificates || [])
        : [];
      if (certsList.length > 0) {
        setCertificates(certsList);
      }

      if (navRes.status === "fulfilled" && navRes.value?.success && navRes.value.data) {
        setNavCounts(navRes.value.data);
      }
    } catch (err) {
      console.warn("Student API sync warning:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [saveCourses, saveAssignments, saveQuizzes]);

  // Load from localStorage first, then sync with live backend
  useEffect(() => {
    try {
      const savedAssignments = localStorage.getItem("sarthi_assignments");
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

      const savedQuizzes = localStorage.getItem("sarthi_quizzes");
      if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));

      const savedSettings = localStorage.getItem("sarthi_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        if (parsed.name) {
          setStudent((prev) => ({ ...prev, name: parsed.name }));
        }
      }

      const savedCourses = localStorage.getItem("sarthi_courses");
      if (savedCourses) {
        try {
          const parsed = JSON.parse(savedCourses);
          const hasMock = Array.isArray(parsed) && parsed.some((c) => 
            c.id === "satellite-meteorology" || c.slug === "satellite-meteorology" || c.id === "nwp-modeling"
          );
          if (hasMock) {
            localStorage.removeItem("sarthi_courses");
          } else {
            setCourses(parsed);
          }
        } catch (e) {
          localStorage.removeItem("sarthi_courses");
        }
      }

      const savedConversations = localStorage.getItem("sarthi_conversations");
      if (savedConversations) setConversations(JSON.parse(savedConversations));
    } catch (e) {
      console.warn("Storage read error:", e);
    }

    refreshBackendData();
  }, [refreshBackendData]);

  // Student Actions
  const toggleBookmark = async (courseId) => {
    const updated = courses.map((c) =>
      c.id === courseId ? { ...c, isBookmarked: !c.isBookmarked } : c
    );
    saveCourses(updated);

    try {
      await fetch(`/api/student/courses/${courseId}/bookmark`, { method: "POST" });
    } catch (err) {
      console.warn("Bookmark toggle backend sync error:", err);
    }
  };

  const submitAssignment = async (assignmentId, { files = [], notes = "" }) => {
    const fileNames = files.map((f) => (typeof f === "string" ? f : f.name));
    const now = new Date().toISOString();
    const updated = assignments.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          status: "submitted",
          submittedAt: now,
          submissionNotes: notes,
          submissionFiles: fileNames.length > 0 ? fileNames : ["solution_submission.pdf"],
        };
      }
      return a;
    });
    saveAssignments(updated);
    setStudent((prev) => ({
      ...prev,
      assignmentsDone: (prev.assignmentsDone || 0) + 1,
      xpPoints: (prev.xpPoints || 0) + 50,
    }));

    try {
      await fetch("/api/student/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, files: fileNames, notes }),
      });
    } catch (err) {
      console.warn("Assignment submission backend sync error:", err);
    }

    return true;
  };

  const submitQuizAttempt = async (quizId, answers) => {
    const targetQuiz = quizzes.find((q) => q.id === quizId);
    if (!targetQuiz || !targetQuiz.questions) return null;

    let correctCount = 0;
    targetQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / targetQuiz.questions.length) * 100);
    const passed = percentage >= targetQuiz.passingScore;
    const pointsEarned = Math.round((percentage / 100) * targetQuiz.totalPoints);

    const updated = quizzes.map((q) => {
      if (q.id === quizId) {
        return {
          ...q,
          status: "completed",
          attempts: (q.attempts || 0) + 1,
          bestScore: Math.max(q.bestScore || 0, percentage),
          completedAt: new Date().toISOString().split("T")[0],
        };
      }
      return q;
    });

    saveQuizzes(updated);
    setStudent((prev) => ({
      ...prev,
      xpPoints: (prev.xpPoints || 0) + pointsEarned,
    }));

    try {
      await fetch("/api/student/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers }),
      });
    } catch (err) {
      console.warn("Quiz submission backend sync error:", err);
    }

    return {
      percentage,
      score: correctCount,
      maxScore: targetQuiz.questions.length,
      passed,
      pointsEarned,
    };
  };

  const registerForLiveClass = async (liveId) => {
    const updated = liveClasses.map((item) =>
      item.id === liveId
        ? {
            ...item,
            isRegistered: true,
            registeredCount: (item.registeredCount || 0) + 1,
          }
        : item
    );
    setLiveClasses(updated);

    try {
      await fetch("/api/student/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liveId }),
      });
    } catch (err) {
      console.warn("Live class registration sync error:", err);
    }
  };

  const markLessonComplete = async (courseId, lessonId) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const completedLessons = Math.min(c.totalLessons, (c.completedLessons || 0) + 1);
        const progress = Math.round((completedLessons / c.totalLessons) * 100);
        return {
          ...c,
          completedLessons,
          progress,
          status: progress === 100 ? "completed" : "active",
        };
      }
      return c;
    });
    saveCourses(updated);

    try {
      await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, progressPct: 100 }),
      });
    } catch (err) {
      console.warn("Lesson complete sync error:", err);
    }
  };

  const updateLessonProgress = (courseId, lessonId, progressPct) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          progress: Math.min(100, Math.max(c.progress || 0, progressPct)),
        };
      }
      return c;
    });
    saveCourses(updated);
  };

  const sendReplyToConversation = (convId, text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const updated = conversations.map((conv) => {
      if (conv.id === convId) {
        return {
          ...conv,
          lastMessage: {
            text,
            timestamp: "Just now",
            sender: "user",
          },
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              sender: "user",
              text,
              timestamp: timeStr,
            },
          ],
        };
      }
      return conv;
    });

    saveConversations(updated);
  };

  const updateSettings = async (newSettings) => {
    saveSettings(newSettings);
    try {
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (err) {
      console.warn("Settings sync error:", err);
    }
  };

  const value = {
    student,
    courses,
    liveClasses,
    assignments,
    quizzes,
    certificates,
    conversations,
    settings,
    navCounts,
    isSyncing,
    activeLiveModal,
    setActiveLiveModal,
    refreshBackendData,
    toggleBookmark,
    submitAssignment,
    submitQuizAttempt,
    registerForLiveClass,
    markLessonComplete,
    updateLessonProgress,
    sendReplyToConversation,
    updateSettings,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
