export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = studentStore.getAssignments();
    return API.ok(data, 'Student assignments retrieved successfully');
  } catch (error) {
    console.error('❌ Student Assignments GET Failure:', error);
    return API.server('Failed to fetch assignments');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { assignmentId, files, notes } = body;

    if (!assignmentId) {
      return API.badRequest('assignmentId is required');
    }

    const submitted = studentStore.submitAssignment(assignmentId, { files, notes });
    if (!submitted) {
      return API.notFound('Assignment not found');
    }

    return API.ok(submitted, 'Assignment submitted to IMD Faculty successfully');
  } catch (error) {
    console.error('❌ Student Assignment POST Failure:', error);
    return API.server('Failed to submit assignment');
  }
}
