export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudent } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateStudent(request);

    const [enrolledCount, liveCount, certCount, unreadNotifs] = await Promise.all([
      prisma.enrollment.count({ where: { userId, status: 'active' } }),
      prisma.liveClass.count({ where: { status: 'LIVE' } }),
      prisma.certificate.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return API.ok({
      enrolledCourses: enrolledCount,
      pendingAssignments: 0,
      upcomingLive: liveCount,
      pendingQuizzes: 0,
      certificatesCount: certCount,
      unreadNotifications: unreadNotifs,
    }, 'Student nav counts retrieved successfully');
  } catch (error: any) {
    console.error('❌ Student Nav Counts GET Failure:', error);
    return API.server('Failed to fetch nav counts');
  }
}
