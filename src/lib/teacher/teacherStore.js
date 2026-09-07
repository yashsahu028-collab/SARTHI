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
} from '@/lib/services/trainerData';

/**
 * Enterprise Teacher Store & Prisma-Compatible Repository Layer
 * Ported from Tech Tomorrow's architecture for SARTHI.
 * Ensures full multi-aggregation, resilient fallback, and real-time state mutation.
 */
class TeacherStore {
  constructor() {
    this.teacher = { ...initialTrainerProfile };
    this.courses = JSON.parse(JSON.stringify(initialTrainerCourses));
    this.students = JSON.parse(JSON.stringify(initialTrainees));
    this.assignments = JSON.parse(JSON.stringify(initialTrainerAssignments));
    this.submissions = JSON.parse(JSON.stringify(initialSubmissionsQueue));
    this.liveClasses = JSON.parse(JSON.stringify(initialTrainerLiveClasses));
    this.quizzes = JSON.parse(JSON.stringify(initialTrainerQuizzes));
    this.certificates = JSON.parse(JSON.stringify(initialTrainerCertificates));
    this.conversations = JSON.parse(JSON.stringify(initialTrainerConversations));
    this.broadcasts = JSON.parse(JSON.stringify(initialBroadcasts));
    this.notifications = [
      {
        id: 'notif-1',
        type: 'submission',
        title: 'New Assignment Submission',
        message: 'Trainee Aarav Verma submitted: Radar Doppler Velocity & Shear Analysis',
        time: '12m ago',
        isRead: false,
        link: '/trainer/assignments',
      },
      {
        id: 'notif-2',
        type: 'live',
        title: 'Upcoming Studio Masterclass',
        message: 'INSAT-3DR Rapid Scanning Protocol starts tomorrow at 10:00 AM IST',
        time: '2h ago',
        isRead: false,
        link: '/trainer/live',
      },
      {
        id: 'notif-3',
        type: 'system',
        title: 'Batch Sync Complete',
        message: 'Quarterly meteorological trainee records updated successfully.',
        time: '1d ago',
        isRead: true,
        link: '/trainer/students',
      },
    ];
  }

  // Teacher Profile
  getTeacherProfile() {
    return { ...this.teacher };
  }

  updateTeacherProfile(data) {
    this.teacher = { ...this.teacher, ...data };
    return this.teacher;
  }

  // Dashboard Aggregations (Exact match for Tech Tomorrow getTeacherDashboardData)
  getDashboardData() {
    const totalStudents = this.students.length;
    const publishedCourses = this.courses.filter(c => c.status === 'active' || c.status === 'published').length;
    const draftCourses = this.courses.filter(c => c.status === 'draft').length;
    const pendingSubmissions = this.submissions.filter(s => s.status === 'pending').length;

    const stats = {
      totalStudents,
      totalCourses: this.courses.length,
      activeCourses: publishedCourses,
      draftCourses,
      pendingEvaluations: pendingSubmissions,
      totalRevenue: 284500, // Tech Tomorrow revenue metric
      activeLearners: totalStudents,
      revenueGrowth: 14.2,
      learnersGrowth: 18.5,
      engagementRate: 88,
      avgRating: 4.9,
      completionRate: 76,
    };

    // Recent activity stream
    const recentActivity = [
      ...this.submissions.slice(0, 4).map(sub => ({
        id: `act-${sub.id}`,
        studentName: sub.studentName,
        courseName: sub.courseTitle,
        type: 'submission',
        status: sub.status,
        timestamp: sub.submittedAt,
        details: `Assignment submitted with score ${sub.score || 'Pending'}`,
      })),
      {
        id: 'act-live-1',
        studentName: 'Dr. R. K. Sharma',
        courseName: 'INSAT-3DR Rapid Scanning',
        type: 'live_scheduled',
        status: 'upcoming',
        timestamp: 'Tomorrow 10:00 AM',
        details: 'Scheduled Masterclass for 45 Trainees',
      },
    ];

    return {
      stats,
      recentActivity,
      teacher: this.teacher,
    };
  }

  // Course Management
  getCourses({ search = '', category = 'All', status = 'all', page = 1, limit = 20 } = {}) {
    let list = [...this.courses];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) || 
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      list = list.filter(c => c.category === category);
    }

    if (status !== 'all') {
      list = list.filter(c => c.status === status);
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      courses: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getCourseById(id) {
    return this.courses.find(c => c.id === id || c.slug === id) || null;
  }

  createCourse(data) {
    const newCourse = {
      id: `course-${Date.now()}`,
      slug: (data.title || 'untitled-course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: data.title,
      description: data.description || 'Specialized meteorological syllabus curriculum.',
      category: data.category || 'Meteorology',
      level: data.level || 'Intermediate',
      price: Number(data.price || 0),
      thumbnail: data.thumbnail || '/images/satellite-meteorology-thumb.jpg',
      status: data.isPublished ? 'active' : 'draft',
      isPublished: Boolean(data.isPublished),
      enrolledCount: 0,
      completionRate: 0,
      totalModules: data.modules?.length || 1,
      totalLessons: data.totalLessons || 12,
      durationHours: data.durationHours || 16,
      lastUpdated: new Date().toISOString().split('T')[0],
      nextLiveClass: 'TBD',
      modules: data.modules || [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Fundamental Concepts & Observational Principles',
          lessonsCount: 4,
          duration: '2h 30m',
          status: 'active',
          lessons: [
            { id: `les-${Date.now()}-1`, title: '1. Theoretical Framework & Overview', duration: '30m', type: 'video' },
            { id: `les-${Date.now()}-2`, title: '2. IMD Observational Lab Session', duration: '45m', type: 'lab' },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.courses.unshift(newCourse);
    this.teacher.activeCoursesCount = this.courses.filter(c => c.status === 'active').length;
    return newCourse;
  }

  updateCourse(id, data) {
    const idx = this.courses.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return null;

    this.courses[idx] = {
      ...this.courses[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.courses[idx];
  }

  toggleCoursePublish(id) {
    const course = this.getCourseById(id);
    if (!course) return null;
    const newStatus = course.status === 'active' ? 'draft' : 'active';
    course.status = newStatus;
    course.isPublished = newStatus === 'active';
    course.updatedAt = new Date().toISOString();
    this.teacher.activeCoursesCount = this.courses.filter(c => c.status === 'active').length;
    return course;
  }

  deleteCourse(id) {
    const idx = this.courses.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) return false;
    this.courses.splice(idx, 1);
    this.teacher.activeCoursesCount = this.courses.filter(c => c.status === 'active').length;
    return true;
  }

  // Assignment Management
  getAssignments() {
    const totalAssignments = this.assignments.length;
    const activeAssignments = this.assignments.filter(a => a.status === 'active' || a.status === 'RELEASED').length;
    const pendingGrading = this.submissions.filter(s => s.status === 'pending').length;

    return {
      assignments: this.assignments,
      stats: {
        totalAssignments,
        activeAssignments,
        pendingGrading,
        avgScore: 84.5,
      },
    };
  }

  getAssignmentById(id) {
    const assignment = this.assignments.find(a => a.id === id);
    if (!assignment) return null;

    const submissions = this.submissions.filter(s => s.assignmentId === id);
    return {
      ...assignment,
      submissions,
    };
  }

  createAssignment(data) {
    const newAsg = {
      id: `asg-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseTitle: this.courses.find(c => c.id === data.courseId)?.title || 'IMD Meteorology Course',
      dueDate: data.dueDate || '2026-03-31',
      maxMarks: Number(data.maxMarks) || 100,
      weightage: data.weightage || '15% of Final Grade',
      status: 'active',
      totalSubmissions: 0,
      gradedCount: 0,
      pendingCount: 0,
      rubric: data.rubric || [
        { criterion: 'Scientific Accuracy & Methodology', marks: 40 },
        { criterion: 'Data Analysis & Technical Depth', marks: 35 },
        { criterion: 'Synthesis & IMD Formatting', marks: 25 },
      ],
      description: data.description || 'Complete the assigned practical analysis following IMD protocols.',
      createdAt: new Date().toISOString(),
    };

    this.assignments.unshift(newAsg);
    return newAsg;
  }

  deleteAssignment(id) {
    const idx = this.assignments.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.assignments.splice(idx, 1);
    return true;
  }

  // Submissions & Grading Desk
  getSubmissions({ status = 'all', search = '', courseId = '' } = {}) {
    let list = [...this.submissions];

    if (status !== 'all') {
      list = list.filter(s => s.status === status);
    }

    if (courseId) {
      list = list.filter(s => s.courseId === courseId);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.studentName.toLowerCase().includes(q) ||
        s.assignmentTitle.toLowerCase().includes(q)
      );
    }

    const pendingCount = this.submissions.filter(s => s.status === 'pending').length;
    const gradedCount = this.submissions.filter(s => s.status === 'graded').length;

    return {
      submissions: list,
      counts: {
        total: this.submissions.length,
        pending: pendingCount,
        graded: gradedCount,
      },
    };
  }

  gradeSubmission(id, { score, feedback }) {
    const sub = this.submissions.find(s => s.id === id);
    if (!sub) return null;

    sub.status = 'graded';
    sub.score = Number(score);
    sub.feedback = feedback || 'Evaluated and approved according to IMD meteorological guidelines.';
    sub.gradedAt = new Date().toISOString();

    // Update assignment counter
    const asg = this.assignments.find(a => a.id === sub.assignmentId);
    if (asg) {
      asg.gradedCount = (asg.gradedCount || 0) + 1;
      asg.pendingCount = Math.max(0, (asg.pendingCount || 1) - 1);
    }

    this.teacher.pendingEvaluationsCount = this.submissions.filter(s => s.status === 'pending').length;
    return sub;
  }

  // Live Studio & Classes
  getLiveClasses() {
    return {
      liveClasses: this.liveClasses,
      activeLive: this.liveClasses.filter(l => l.status === 'live'),
      upcoming: this.liveClasses.filter(l => l.status === 'upcoming'),
      completed: this.liveClasses.filter(l => l.status === 'completed'),
    };
  }

  createLiveClass(data) {
    const d = new Date(data.date || Date.now());
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const newLive = {
      id: `live-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseName: this.courses.find(c => c.id === data.courseId)?.title || 'IMD Specialized Meteorological Masterclass',
      batch: data.batch || 'All IMD Probationary Batches',
      date: data.date || new Date().toISOString().split('T')[0],
      day: String(d.getDate()).padStart(2, '0'),
      month: months[d.getMonth()] || 'MAR',
      time: data.time || '10:00 AM - 11:30 AM IST',
      scheduledStartTime: `${data.date || '2026-03-15'}T10:00:00Z`,
      durationMinutes: data.durationMinutes || 90,
      status: 'upcoming',
      registeredCount: 48,
      attendedCount: 0,
      meetingUrl: `https://meet.imd.gov.in/studio-${Date.now().toString().slice(-4)}`,
      roomId: `studio-live-${Date.now().toString().slice(-6)}`,
      passcode: 'IMD-TRAINER-2026',
      agenda: data.agenda || ['Atmospheric sounding review', 'Interactive radar walk-through', 'Trainee Q&A session'],
      materials: ['meteorological_handout.pdf'],
      createdAt: new Date().toISOString(),
    };

    this.liveClasses.unshift(newLive);
    return newLive;
  }

  startQuickLive() {
    const now = new Date();
    const roomId = `livekit-room-${Date.now()}`;
    const quickSession = {
      id: `quick-${Date.now()}`,
      title: 'Instant Meteorological Studio Broadcast',
      courseName: 'Ad-hoc Radar & Cyclone Briefing',
      batch: 'All Active Trainees',
      date: now.toISOString().split('T')[0],
      day: String(now.getDate()).padStart(2, '0'),
      month: 'MAR',
      time: 'Live Right Now',
      scheduledStartTime: now.toISOString(),
      durationMinutes: 60,
      status: 'live',
      registeredCount: 32,
      attendedCount: 18,
      meetingUrl: `https://meet.imd.gov.in/studio/${roomId}`,
      roomId,
      passcode: 'IMD-LIVE-NOW',
      agenda: ['Immediate Weather Disturbance Briefing', 'Q&A Desk'],
      createdAt: now.toISOString(),
    };

    this.liveClasses.unshift(quickSession);
    return { roomId, session: quickSession };
  }

  // Trainees / Students
  getStudents({ search = '', status = 'all', page = 1, limit = 20 } = {}) {
    let list = [...this.students];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.currentStation && s.currentStation.toLowerCase().includes(q))
      );
    }

    if (status !== 'all') {
      list = list.filter(s => s.status === status);
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      students: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalLearners: this.students.length,
        activeLearners: this.students.filter(s => s.status === 'active').length,
        distinctionCount: this.students.filter(s => s.avgScore >= 90).length,
        flaggedForSupport: this.students.filter(s => s.status === 'struggling' || s.avgScore < 70).length,
      },
    };
  }

  // Analytics Engine
  getAnalytics() {
    return {
      totalRevenue: 284500,
      activeStudents: this.students.length,
      enrollmentRate: 92.4,
      avgRating: 4.9,
      completionRate: 76.8,
      trends: {
        revenue: 14.2,
        students: 18.5,
        enrollment: 8.4,
        rating: 0.3,
      },
      revenueMonthly: [
        { month: 'Oct', revenue: 38000, students: 24 },
        { month: 'Nov', revenue: 45000, students: 32 },
        { month: 'Dec', revenue: 52000, students: 40 },
        { month: 'Jan', revenue: 58000, students: 45 },
        { month: 'Feb', revenue: 64000, students: 51 },
        { month: 'Mar', revenue: 72000, students: 68 },
      ],
      courseBreakdown: this.courses.map(c => ({
        id: c.id,
        title: c.title,
        studentsEnrolled: c.enrolledCount,
        completionRate: c.completionRate,
        category: c.category,
      })),
      studentsAtRisk: this.students.filter(s => s.avgScore < 75).map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        score: s.avgScore,
        attendance: s.attendance,
      })),
    };
  }

  // Nav Counts (For Sidebar Badges)
  getNavCounts() {
    return {
      courseCount: this.courses.length,
      studentCount: this.students.length,
      pendingGrading: this.submissions.filter(s => s.status === 'pending').length,
      upcomingLive: this.liveClasses.filter(l => l.status === 'upcoming' || l.status === 'live').length,
      unreadMessages: this.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
      unreadNotifications: this.notifications.filter(n => !n.isRead).length,
    };
  }

  // Announcements
  getAnnouncements() {
    return [...this.broadcasts];
  }

  createAnnouncement(data) {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 16) + ' IST';
    const newBcast = {
      id: `bcast-${Date.now()}`,
      title: data.title,
      targetBatch: data.targetBatch || 'All Trainee Batches',
      sentAt: dateStr,
      message: data.message,
      recipientCount: this.students.length || 186,
      createdAt: now.toISOString(),
    };

    this.broadcasts.unshift(newBcast);
    return newBcast;
  }

  // Notifications
  getNotifications() {
    return [...this.notifications];
  }

  markNotificationRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
    return notif;
  }

  // Messages & Conversations
  getMessages() {
    return [...this.conversations];
  }

  createMessage(conversationId, { text, sender = 'trainer' }) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return null;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: timeStr,
    };

    conv.messages.push(newMsg);
    conv.lastMessage = {
      text,
      timestamp: 'Just now',
      sender,
    };
    if (sender === 'trainer') {
      conv.unreadCount = 0;
    }
    return newMsg;
  }
}

// Global Singleton to preserve data across HMR in development
const globalForTeacherStore = global;
export const teacherStore = globalForTeacherStore.__sarthi_teacher_store || new TeacherStore();
if (process.env.NODE_ENV !== 'production') {
  globalForTeacherStore.__sarthi_teacher_store = teacherStore;
}
