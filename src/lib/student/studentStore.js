import {
  initialStudentProfile,
  initialCourses,
  initialLiveClasses,
  initialAssignments,
  initialQuizzes,
  initialCertificates,
  initialConversations,
  initialSettings,
} from '@/lib/services/studentData';
import { teacherStore } from '@/lib/teacher/teacherStore';

/**
 * Enterprise Student Store & Repository Layer
 * Ported from Tech Tomorrow's student architecture for SARTHI.
 * Coordinates real-time data across student and teacher ecosystems.
 */
class StudentStore {
  constructor() {
    this.student = { ...initialStudentProfile };
    this.courses = JSON.parse(JSON.stringify(initialCourses));
    this.liveClasses = JSON.parse(JSON.stringify(initialLiveClasses));
    this.assignments = JSON.parse(JSON.stringify(initialAssignments));
    this.quizzes = JSON.parse(JSON.stringify(initialQuizzes));
    this.certificates = JSON.parse(JSON.stringify(initialCertificates));
    this.conversations = JSON.parse(JSON.stringify(initialConversations));
    this.settings = JSON.parse(JSON.stringify(initialSettings));
    this.notifications = [
      {
        id: 'notif-s-1',
        title: 'Assignment Evaluated',
        message: 'Dr. R. K. Sharma graded your INSAT-3D Radiance Analysis submission with 96/100.',
        time: '1h ago',
        isRead: false,
        link: '/dashboard/assignments',
      },
      {
        id: 'notif-s-2',
        title: 'New Live Masterclass Scheduled',
        message: 'INSAT-3DR Rapid Scanning Protocol masterclass starts tomorrow at 10:00 AM IST.',
        time: '3h ago',
        isRead: false,
        link: '/dashboard/live',
      },
      {
        id: 'notif-s-3',
        title: 'Certificate Issued',
        message: 'Your NWP Primitive Equations & Modeling certification is available for verification.',
        time: '2d ago',
        isRead: true,
        link: '/dashboard/certificates',
      },
    ];
  }

  // Dashboard Aggregations (Matches Tech Tomorrow /api/student/dashboard)
  getDashboardData() {
    const activeCourses = this.courses.filter(c => c.status === 'active');
    const completedCourses = this.courses.filter(c => c.status === 'completed');
    const pendingAssignments = this.assignments.filter(a => a.status === 'pending');
    const upcomingLive = this.liveClasses.filter(l => l.status === 'upcoming');

    // Overall completion percentage
    const totalProgressSum = this.courses.reduce((sum, c) => sum + (c.progress || 0), 0);
    const avgProgress = this.courses.length > 0 ? Math.round(totalProgressSum / this.courses.length) : 0;

    return {
      student: {
        ...this.student,
        overallProgress: avgProgress,
        enrolledCoursesCount: this.courses.length,
      },
      stats: {
        enrolledCourses: this.courses.length,
        activeCourses: activeCourses.length,
        completedCourses: completedCourses.length,
        hoursLearned: this.student.hoursLearned,
        assignmentsDone: this.student.assignmentsDone,
        pendingAssignments: pendingAssignments.length,
        xpPoints: this.student.xpPoints,
        certificatesCount: this.certificates.length,
      },
      activeCourses,
      recentSubmissions: this.assignments.filter(a => a.status === 'submitted' || a.status === 'graded'),
      upcomingLiveClasses: upcomingLive.slice(0, 3),
      notifications: this.notifications,
    };
  }

  // Course Management
  getCourses({ search = '', category = 'All', status = 'all' } = {}) {
    let list = [...this.courses];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      list = list.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (status !== 'all') {
      list = list.filter(c => c.status === status);
    }

    return {
      courses: list,
      count: list.length,
      totalCount: this.courses.length,
    };
  }

  getCourseById(id) {
    return this.courses.find(c => c.id === id || c.slug === id) || null;
  }

  toggleBookmark(courseId) {
    const course = this.getCourseById(courseId);
    if (!course) return null;
    course.isBookmarked = !course.isBookmarked;
    return course;
  }

  // Assignment Management
  getAssignments() {
    return {
      assignments: this.assignments,
      counts: {
        total: this.assignments.length,
        pending: this.assignments.filter(a => a.status === 'pending').length,
        submitted: this.assignments.filter(a => a.status === 'submitted').length,
        graded: this.assignments.filter(a => a.status === 'graded').length,
      },
    };
  }

  submitAssignment(assignmentId, { files = [], notes = '' }) {
    const asg = this.assignments.find(a => a.id === assignmentId);
    if (!asg) return null;

    const fileNames = files.map(f => (typeof f === 'string' ? f : f.name || 'document.pdf'));
    const now = new Date().toISOString();

    asg.status = 'submitted';
    asg.submittedAt = now;
    asg.submissionNotes = notes;
    asg.submissionFiles = fileNames.length > 0 ? fileNames : ['meteorological_solution.py', 'analysis_report.pdf'];

    this.student.assignmentsDone = (this.student.assignmentsDone || 0) + 1;
    this.student.xpPoints = (this.student.xpPoints || 0) + 50;

    // Cross-post to Teacher's Submissions Queue in teacherStore
    try {
      const submissionObj = {
        id: `sub-std-${Date.now()}`,
        assignmentId: asg.id,
        assignmentTitle: asg.title,
        courseTitle: asg.courseTitle || 'IMD Specialization Course',
        studentId: this.student.id,
        studentName: this.student.name,
        studentEmail: this.student.email,
        studentAvatar: this.student.avatar,
        division: this.student.division,
        submittedAt: now,
        status: 'pending',
        score: null,
        maxScore: asg.maxMarks || 100,
        files: asg.submissionFiles,
        studentNotes: notes,
      };
      teacherStore.submissions.unshift(submissionObj);
      teacherStore.teacher.pendingEvaluationsCount = teacherStore.submissions.filter(s => s.status === 'pending').length;
    } catch (e) {
      console.warn('Sync to teacherStore warning:', e);
    }

    return asg;
  }

  // Live Studio Sessions
  getLiveClasses() {
    return {
      liveClasses: this.liveClasses,
      upcoming: this.liveClasses.filter(l => l.status === 'upcoming'),
      registeredCount: this.liveClasses.filter(l => l.isRegistered).length,
    };
  }

  registerLiveClass(liveId) {
    const live = this.liveClasses.find(l => l.id === liveId);
    if (!live) return null;
    live.isRegistered = true;
    live.registeredCount = (live.registeredCount || 0) + 1;
    return live;
  }

  // Quizzes & Assessments
  getQuizzes() {
    return {
      quizzes: this.quizzes,
      totalPassed: this.quizzes.filter(q => q.status === 'completed' && q.bestScore >= q.passingScore).length,
    };
  }

  submitQuizAttempt(quizId, answers) {
    const quiz = this.quizzes.find(q => q.id === quizId);
    if (!quiz || !quiz.questions) return null;

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = percentage >= (quiz.passingScore || 70);
    const pointsEarned = Math.round((percentage / 100) * (quiz.totalPoints || 100));

    quiz.status = 'completed';
    quiz.attempts = (quiz.attempts || 0) + 1;
    quiz.bestScore = Math.max(quiz.bestScore || 0, percentage);
    quiz.completedAt = new Date().toISOString().split('T')[0];

    this.student.xpPoints = (this.student.xpPoints || 0) + pointsEarned;

    return {
      quizId,
      percentage,
      score: correctCount,
      maxScore: quiz.questions.length,
      passed,
      pointsEarned,
    };
  }

  // Certificates
  getCertificates() {
    return {
      certificates: this.certificates,
      count: this.certificates.length,
    };
  }

  // Progress Engine
  getProgress() {
    return {
      overallProgress: this.student.overallProgress || 92,
      hoursLearned: this.student.hoursLearned || 14.5,
      assignmentsDone: this.student.assignmentsDone || 18,
      xpPoints: this.student.xpPoints || 850,
      attendanceRate: this.student.attendanceRate || '94%',
      courses: this.courses.map(c => ({
        id: c.id,
        title: c.title,
        category: c.category,
        progress: c.progress,
        status: c.status,
        completedLessons: c.completedLessons,
        totalLessons: c.totalLessons,
      })),
      weeklyActivity: [
        { day: 'Mon', hours: 2.5, completed: 3 },
        { day: 'Tue', hours: 3.0, completed: 4 },
        { day: 'Wed', hours: 1.5, completed: 2 },
        { day: 'Thu', hours: 4.0, completed: 5 },
        { day: 'Fri', hours: 3.5, completed: 4 },
        { day: 'Sat', hours: 2.0, completed: 2 },
        { day: 'Sun', hours: 1.0, completed: 1 },
      ],
    };
  }

  updateLessonProgress(courseId, lessonId, progressPct = 100) {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    if (progressPct === 100) {
      course.completedLessons = Math.min(course.totalLessons, (course.completedLessons || 0) + 1);
      course.progress = Math.round((course.completedLessons / course.totalLessons) * 100);
      if (course.progress === 100) course.status = 'completed';
    }

    return {
      courseId,
      lessonId,
      progress: course.progress,
      completedLessons: course.completedLessons,
    };
  }

  // Profile and Settings
  getProfile() {
    return {
      student: this.student,
      settings: this.settings,
    };
  }

  updateProfile(data) {
    this.student = { ...this.student, ...data };
    return this.student;
  }

  updateSettings(data) {
    this.settings = { ...this.settings, ...data };
    if (data.name) this.student.name = data.name;
    return this.settings;
  }

  // Sidebar Badge Counts
  getNavCounts() {
    return {
      enrolledCourses: this.courses.length,
      pendingAssignments: this.assignments.filter(a => a.status === 'pending').length,
      upcomingLive: this.liveClasses.filter(l => l.status === 'upcoming').length,
      pendingQuizzes: this.quizzes.filter(q => q.status === 'available').length,
      certificatesCount: this.certificates.length,
      unreadNotifications: this.notifications.filter(n => !n.isRead).length,
    };
  }
}

// Global Singleton to preserve data across HMR in development
const globalForStudentStore = global;
export const studentStore = globalForStudentStore.__sarthi_student_store || new StudentStore();
if (process.env.NODE_ENV !== 'production') {
  globalForStudentStore.__sarthi_student_store = studentStore;
}
