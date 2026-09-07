export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateTeacher } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const teacherId = await authenticateTeacher(request);
    const { id } = await params;
    const body = await request.json();
    const { score, feedback } = body;

    if (score === undefined || score === null) {
      return API.badRequest('Score is required');
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        grade: Number(score),
        feedback: feedback || '',
        status: 'GRADED',
        gradedById: teacherId,
        gradedAt: new Date(),
      },
    }).catch(async () => {
      // Fallback for assignmentSubmission if submission id not found
      return await prisma.assignmentSubmission.update({
        where: { id },
        data: {
          score: Number(score),
          status: 'GRADED',
        },
      });
    });

    return API.ok(updated, 'Submission graded successfully in database');
  } catch (error: any) {
    console.error('❌ Submission PATCH Failure:', error);
    return API.server('Failed to evaluate submission');
  }
}
