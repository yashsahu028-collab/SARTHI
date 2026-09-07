// SARTHI Trainer Data Service
// Live Database Architecture — Powered by Hostinger MySQL via Prisma

export const initialTrainerProfile = {
  id: "cmp9eaqu600008iuvgyokhpxw",
  teacherId: "cmp9qrrmy0001zzsx13cd4oij",
  name: "Mohit Raj",
  title: "Instructor & Lead Specialist",
  division: "Advanced Technology & Enterprise Learning",
  organization: "SARTHI Academy",
  email: "mohitraj8503.edu@gmail.com",
  avatar: "/images/student-img-1.jpg",
  totalStudents: 1,
  activeCoursesCount: 2,
  pendingEvaluationsCount: 0,
  averagePassRate: 95.0,
  totalTrainingHours: 24.0,
  upcomingBatchesCount: 2,
  officeHours: "Mon-Fri: 14:00 - 16:00 IST",
  roomLocation: "Virtual Studio / Lab 1",
  bio: "Lead Instructor and curriculum architect specializing in Business Intelligence, Advanced Data Analytics, and Cloud Infrastructure.",
};

export const initialTrainerCourses = [];

export const initialTrainees = [];

export const initialTrainerAssignments = [];

export const initialSubmissionsQueue = [];

export const initialTrainerLiveClasses = [];

export const initialTrainerQuizzes = [];

export const initialTrainerCertificates = [];

export const initialTrainerConversations = [
  {
    id: "conv-support-trainer",
    instructorId: "helpdesk-sarthi",
    name: "SARTHI Faculty Desk",
    role: "Academic Training Operations",
    division: "Instructor Operations",
    avatar: "/images/student-img-1.jpg",
    online: true,
    lastActive: "24/7 Portal",
    unreadCount: 0,
    messages: [
      {
        id: "msg-t-1",
        sender: "instructor",
        text: "Welcome Instructor Mohit Raj. Your course catalog and trainee roster are connected directly to the live database.",
        time: "Just now",
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

export const initialBroadcasts = [
  {
    id: "bcast-welcome",
    title: "Live Database Backend Connected",
    targetBatch: "All Enrolled Batches",
    sentAt: new Date().toISOString().replace("T", " ").slice(0, 16) + " IST",
    message: "Live synchronization with database active. All student grades, courses, and schedules are reflected in real time.",
    recipientCount: 158,
  },
];
