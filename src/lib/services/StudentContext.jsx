"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect } from "react";
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

  // Load from localStorage if present
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
        const thumbMap = {
          "satellite-meteorology": "/images/satellite-meteorology-thumb.jpg",
          "nwp-modeling": "/images/nwp-modeling-thumb.jpg",
          "doppler-radar-dynamics": "/images/doppler-radar-thumb.jpg",
          "climate-trend-analytics": "/images/monsoon-climate-thumb.jpg",
        };
        const parsed = JSON.parse(savedCourses)
          .filter((c) => c.id !== "python-met-data" && c.slug !== "python-met-data")
          .map((c) => ({
            ...c,
            thumbnail: thumbMap[c.id] || c.thumbnail,
          }));
        setCourses(parsed);
        localStorage.setItem("sarthi_courses", JSON.stringify(parsed));
      }

      const savedConversations = localStorage.getItem("sarthi_conversations");
      if (savedConversations) setConversations(JSON.parse(savedConversations));
    } catch (e) {
      console.warn("Storage read error:", e);
    }
  }, []);

  // Save changes helpers
  const saveAssignments = (newAssignments) => {
    setAssignments(newAssignments);
    try {
      localStorage.setItem("sarthi_assignments", JSON.stringify(newAssignments));
    } catch (e) {}
  };

  const saveQuizzes = (newQuizzes) => {
    setQuizzes(newQuizzes);
    try {
      localStorage.setItem("sarthi_quizzes", JSON.stringify(newQuizzes));
    } catch (e) {}
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    if (newSettings.name) {
      setStudent((prev) => ({ ...prev, name: newSettings.name }));
    }
    try {
      localStorage.setItem("sarthi_settings", JSON.stringify(newSettings));
    } catch (e) {}
  };

  const saveCourses = (newCourses) => {
    setCourses(newCourses);
    try {
      localStorage.setItem("sarthi_courses", JSON.stringify(newCourses));
    } catch (e) {}
  };

  const saveConversations = (newConvs) => {
    setConversations(newConvs);
    try {
      localStorage.setItem("sarthi_conversations", JSON.stringify(newConvs));
    } catch (e) {}
  };

  // Student Actions
  const toggleBookmark = (courseId) => {
    const updated = courses.map((c) =>
      c.id === courseId ? { ...c, isBookmarked: !c.isBookmarked } : c
    );
    saveCourses(updated);
  };

  const submitAssignment = (assignmentId, { files = [], notes = "" }) => {
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
      assignmentsDone: prev.assignmentsDone + 1,
      xpPoints: prev.xpPoints + 50,
    }));
    return true;
  };

  const submitQuizAttempt = (quizId, answers) => {
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
      xpPoints: prev.xpPoints + pointsEarned,
    }));

    return {
      percentage,
      score: correctCount,
      maxScore: targetQuiz.questions.length,
      passed,
      pointsEarned,
    };
  };

  const sendMessage = (conversationId, text) => {
    if (!text || !text.trim()) return;
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "student",
      text: text.trim(),
      time: nowStr,
      timestamp: new Date().toISOString(),
    };

    let updatedConvs = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          unreadCount: 0,
        };
      }
      return conv;
    });
    saveConversations(updatedConvs);

    // Auto-reply simulation from instructor after 1.5 seconds if message is to an instructor
    const activeConv = conversations.find((c) => c.id === conversationId);
    if (activeConv && !activeConv.isGroup) {
      setTimeout(() => {
        const replyMsg = {
          id: "reply-" + Date.now(),
          sender: "instructor",
          text: `Thank you Mohit! I've noted: "${text.slice(0, 35)}...". Keep up the great scientific progress. Let's discuss in the upcoming lab session.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: new Date().toISOString(),
        };
        setConversations((currentConvs) => {
          const updated = currentConvs.map((c) =>
            c.id === conversationId ? { ...c, messages: [...c.messages, replyMsg] } : c
          );
          try {
            localStorage.setItem("sarthi_conversations", JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }, 1500);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        courses,
        liveClasses,
        assignments,
        quizzes,
        certificates,
        conversations,
        settings,
        activeLiveModal,
        setActiveLiveModal,
        toggleBookmark,
        submitAssignment,
        submitQuizAttempt,
        sendMessage,
        saveSettings,
      }}
    >
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
