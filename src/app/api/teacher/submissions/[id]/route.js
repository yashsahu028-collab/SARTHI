export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { score, feedback } = body;

    if (score === undefined || score === null) {
      return API.badRequest('Score is required to grade submission');
    }

    const graded = teacherStore.gradeSubmission(id, { score, feedback });
    if (!graded) {
      return API.notFound('Submission not found');
    }

    return API.ok(graded, 'Submission evaluated and graded successfully');
  } catch (error) {
    console.error('❌ Submission PATCH Failure:', error);
    return API.server('Failed to evaluate submission');
  }
}
