export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = teacherStore.getAssignments();
    return API.ok(data, 'Assignments retrieved successfully');
  } catch (error) {
    console.error('❌ Assignments GET Failure:', error);
    return API.server('Failed to fetch assignments');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return API.badRequest('Assignment title is required');
    }

    const newAssignment = teacherStore.createAssignment(body);
    return API.created(newAssignment, 'Assignment created successfully');
  } catch (error) {
    console.error('❌ Assignments POST Failure:', error);
    return API.server('Failed to create assignment');
  }
}
