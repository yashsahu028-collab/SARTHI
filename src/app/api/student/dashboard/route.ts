export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudent } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateStudent(request);

    // Concurrently fetch real user, enrollments, certificates, and notifications
    const [user, enrollments, certsCount, submissions, notifications] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          avatar_url: true,
          totalPoints: true,
          role: true,
        },
      }),
      prisma.enrollment.findMany({
        where: { userId, status: 'active' },
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  avatar_url: true,
                },
              },
              Category: true,
              lessons: { select: { id: true, title: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.certificate.count({ where: { userId } }),
      prisma.assignmentSubmission.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.findMany({
        where: { userId, isRead: false },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const activeEnrollments = enrollments || [];
    const totalProgress = activeEnrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0);
    const avgProgress = activeEnrollments.length > 0 ? Math.round(totalProgress / activeEnrollments.length) : 0;

    const studentProfile = {
      id: user?.id || userId,
      name: user?.name || 'Mohit Raj',
      email: user?.email || 'mohitraj8503@gmail.com',
      role: 'SARTHI Trainee & Scholar',
      division: 'Technology & Artificial Intelligence Division',
      avatar: user?.avatar_url || user?.image || '/images/student-img-1.jpg',
      enrolledCoursesCount: activeEnrollments.length,
      hoursLearned: 18.5,
      assignmentsDone: submissions?.length || 0,
      overallProgress: avgProgress,
      xpPoints: user?.totalPoints || 1250,
      certificatesCount: certsCount || 0,
      attendanceRate: '96%',
    };

    const transformedCourses = activeEnrollments.map((e) => ({
      id: e.course.id,
      slug: e.course.slug,
      title: e.course.title,
      description: e.course.description,
      category: e.course.Category?.name || e.course.category || 'General',
      thumbnail: e.course.thumbnail || '/courses/default.png',
      progress: e.progressPercentage || 0,
      totalLessons: e.course.lessons?.length || 10,
      completedLessons: Math.round(((e.progressPercentage || 0) / 100) * (e.course.lessons?.length || 10)),
      status: e.progressPercentage === 100 ? 'completed' : 'active',
      instructor: {
        name: e.course.instructor?.name || 'Faculty Specialist',
        avatar: e.course.instructor?.avatar_url || e.course.instructor?.image || '/images/student-img-1.jpg',
      },
    }));

    return API.ok({
      student: studentProfile,
      courses: transformedCourses,
      submissions: submissions || [],
      notifications: notifications || [],
      stats: {
        enrolledCourses: activeEnrollments.length,
        activeCourses: activeEnrollments.length,
        completedCourses: activeEnrollments.filter((e) => e.progressPercentage === 100).length,
        hoursLearned: studentProfile.hoursLearned,
        assignmentsDone: studentProfile.assignmentsDone,
        xpPoints: studentProfile.xpPoints,
        certificatesCount: certsCount,
      },
    }, 'Student dashboard data retrieved successfully');
  } catch (error: any) {
    console.error('❌ Student Dashboard Unhandled Failure:', error);
    return API.server('Failed to fetch dashboard data');
  }
}
