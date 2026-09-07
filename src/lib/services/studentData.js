// SARTHI Student Data Service
// Live Database Architecture — Powered by Hostinger MySQL via Prisma

export const initialStudentProfile = {
  id: "cmp86ntpx0000lmutor3koqmz",
  name: "Mohit Raj",
  email: "mohitraj8503@gmail.com",
  role: "SARTHI Trainee & Scholar",
  division: "Technology & Artificial Intelligence Division",
  avatar: "/images/student-img-1.jpg",
  enrolledCoursesCount: 3,
  hoursLearned: 18.5,
  assignmentsDone: 0,
  overallProgress: 0,
  xpPoints: 1250,
  certificatesCount: 1,
  attendanceRate: "96%",
};

export const initialCourses = [];

export const initialLiveClasses = [];

export const initialAssignments = [];

export const initialQuizzes = [];

export const initialCertificates = [];

export const initialConversations = [
  {
    id: "conv-support",
    instructorId: "helpdesk-sarthi",
    name: "SARTHI Academic Support Desk",
    role: "Training Coordinator",
    division: "Technical & Student Portal Desk",
    avatar: "/images/student-img-1.jpg",
    online: true,
    lastActive: "24/7 Portal",
    unreadCount: 0,
    messages: [
      {
        id: "smsg-1",
        sender: "instructor",
        text: "Welcome to SARTHI! Your verified trainee profile and MySQL backend have been synchronized with the live server.",
        time: "Just now",
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

export const initialSettings = {
  name: "Mohit Raj",
  email: "mohitraj8503@gmail.com",
  role: "SARTHI Trainee & Scholar",
  division: "Technology & Artificial Intelligence Division",
  bio: "Full Stack Engineer & AI developer working on SARTHI cloud infrastructure and distributed analytics systems.",
  phone: "+91 98765 43210",
  location: "New Delhi, India",
  timezone: "Asia/Kolkata (IST +5:30)",
  avatar: "/images/student-img-1.jpg",
  notifications: {
    emailAlerts: true,
    liveClassReminders: true,
    assignmentDeadlines: true,
    quizAnnouncements: true,
    chatMessages: true,
  },
  security: {
    twoFactorEnabled: true,
    sessionPersistence: true,
  },
};
