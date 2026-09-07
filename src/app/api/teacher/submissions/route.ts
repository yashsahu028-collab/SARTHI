import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateTeacher } from '@/lib/auth/middleware';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all'; // pending, graded, all

    const userId = await authenticateTeacher(request);

    const teacher = await prisma.teacher.findFirst({
      where: { userId }
    });

    // Build where clause
    const whereClause: Prisma.SubmissionWhereInput = {
      lesson: {
        course: {
          OR: [
            { instructorId: userId },
            ...(teacher ? [{ teacherId: teacher.id }] : [])
          ]
        },
      },
    };

    if (status !== 'all') {
      if (status === 'pending') {
        whereClause.status = { in: ['SUBMITTED', 'PENDING'] };
      } else if (status === 'graded') {
        whereClause.status = 'GRADED';
      }
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform for Trainer UI
    const transformedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      studentId: sub.user.id,
      studentName: sub.user.name || 'Enrolled Trainee',
      studentEmail: sub.user.email || '',
      studentAvatar: sub.user.image || '/images/student-img-1.jpg',
      division: 'Advanced Technology & Meteorology',
      assignmentId: sub.lesson.id,
      assignmentTitle: sub.lesson.title,
      courseId: sub.lesson.course.id,
      courseTitle: sub.lesson.course.title,
      status: sub.status === 'GRADED' ? 'graded' : 'pending',
      score: sub.grade,
      maxScore: 100,
      feedback: sub.feedback || '',
      submittedAt: sub.createdAt,
      content: sub.content || '',
      fileUrl: sub.fileUrl,
    }));

    return NextResponse.json({ success: true, data: { submissions: transformedSubmissions } });
  } catch (error: any) {
    console.error('[TeacherSubmissions] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

