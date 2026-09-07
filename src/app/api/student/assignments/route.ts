export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudent } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateStudent(request);

    // Get user's enrolled course IDs
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);

    // Fetch assignments for enrolled courses or all active assignments
    const assignments = await prisma.assignment.findMany({
      where: courseIds.length > 0
        ? { OR: [{ courseId: { in: courseIds } }, { courseId: null }] }
        : {},
      include: {
        course: { select: { id: true, title: true } },
        attempts: {
          where: { userId },
          select: { id: true, score: true, maxScore: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { userId },
      include: {
        assignment: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformed = assignments.map((a) => {
      const submission = submissions.find((s) => s.assignmentId === a.id);
      const attempt = a.attempts?.[0];

      let status = 'pending';
      if (submission?.status === 'graded' || attempt) status = 'graded';
      else if (submission) status = 'submitted';

      return {
        id: a.id,
        title: a.title,
        courseId: a.courseId || 'general',
        courseTitle: a.course?.title || 'Academic Program',
        dueDate: a.dueAt ? a.dueAt.toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
        dueDateFormatted: a.dueAt ? a.dueAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Next Week',
        maxScore: a.totalQuestions ? a.totalQuestions * 10 : 100,
        passingScore: 70,
        status,
        score: submission?.score || attempt?.score || null,
        submittedAt: submission?.createdAt?.toISOString() || null,
        submissionNotes: null,
        submissionFiles: [],
        instructor: {
          name: 'Program Faculty',
          email: 'faculty@sarthi.gov.in',
          avatar: '/images/student-img-1.jpg',
        },
        description: a.description || 'Complete the analytical assignment per guidelines and submit the report before the deadline.',
      };
    });

    return API.ok({
      assignments: transformed,
      counts: {
        total: transformed.length,
        pending: transformed.filter((a) => a.status === 'pending').length,
        submitted: transformed.filter((a) => a.status === 'submitted').length,
        graded: transformed.filter((a) => a.status === 'graded').length,
      },
    }, 'Assignments retrieved successfully');
  } catch (error: any) {
    console.error('❌ Student Assignments Failure:', error);
    return API.server('Failed to fetch assignments');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateStudent(request);
    const body = await request.json();
    const { assignmentId, files = [], notes = '' } = body;

    if (!assignmentId) {
      return API.badRequest('assignmentId is required');
    }

    const fileNames = files.map((f: any) => (typeof f === 'string' ? f : f.name || 'document.pdf'));

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        userId,
        fileUrl: fileNames.join(','),
        status: 'SUBMITTED',
      },
    });

    return API.ok(submission, 'Assignment submitted successfully');
  } catch (error: any) {
    console.error('❌ Student Assignment Submission Failure:', error);
    return API.server('Failed to submit assignment');
  }
}
