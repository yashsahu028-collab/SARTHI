export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const assignment = teacherStore.getAssignmentById(id);
    if (!assignment) {
      return API.notFound('Assignment not found');
    }
    return API.ok(assignment);
  } catch (error) {
    console.error('❌ Assignment GET Failure:', error);
    return API.server('Failed to fetch assignment');
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = teacherStore.deleteAssignment(id);
    if (!success) {
      return API.notFound('Assignment not found');
    }
    return API.ok({ id }, 'Assignment deleted successfully');
  } catch (error) {
    console.error('❌ Assignment DELETE Failure:', error);
    return API.server('Failed to delete assignment');
  }
}
