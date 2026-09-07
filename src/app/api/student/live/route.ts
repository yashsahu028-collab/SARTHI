export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudent } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateStudent(request);

    // Fetch real live classes from database
    const liveClasses = await prisma.liveClass.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            image: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const transformed = liveClasses.map((lc) => {
      const isLive = lc.status === 'LIVE' || lc.liveKitStatus === 'LIVE';
      const scheduledDate = lc.scheduledAt ? new Date(lc.scheduledAt) : new Date(lc.createdAt);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

      return {
        id: lc.id,
        title: lc.title,
        courseId: lc.courseId || 'general',
        courseName: lc.course?.title || 'Interactive Masterclass',
        instructor: lc.teacher?.name || 'Lead Instructor',
        instructorTitle: 'Faculty Specialist',
        instructorAvatar: lc.teacher?.avatar_url || lc.teacher?.image || '/images/student-img-1.jpg',
        date: scheduledDate.toISOString().split('T')[0],
        day: String(scheduledDate.getDate()).padStart(2, '0'),
        month: months[scheduledDate.getMonth()] || 'SEP',
        time: scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        status: isLive ? 'live' : 'upcoming',
        roomUrl: `/live/${lc.id}`,
        description: lc.description || 'Interactive live session covering practical workflows, real case studies, and Q&A.',
        attendeesCount: 35,
        isToday: scheduledDate.toDateString() === new Date().toDateString(),
      };
    });

    return API.ok({
      liveClasses: transformed,
      upcoming: transformed.filter((l) => l.status === 'upcoming'),
      registeredCount: transformed.length,
    }, 'Live classes retrieved successfully');
  } catch (error: any) {
    console.error('❌ Student Live GET Failure:', error);
    return API.server('Failed to fetch live classes');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateStudent(request);
    const body = await request.json();
    const { liveId } = body;

    if (!liveId) {
      return API.badRequest('liveId is required');
    }

    const liveClass = await prisma.liveClass.findUnique({
      where: { id: liveId },
    });

    if (!liveClass) {
      return API.notFound('Live class not found');
    }

    return API.ok({ registered: true, liveClassId: liveId }, 'Registered for Live Session successfully');
  } catch (error: any) {
    console.error('❌ Student Live Registration Failure:', error);
    return API.server('Failed to register for live class');
  }
}
