export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const course = studentStore.getCourseById(id);
    if (!course) {
      return API.notFound('Enrolled course not found');
    }
    return API.ok(course);
  } catch (error) {
    console.error('❌ Student Course GET Failure:', error);
    return API.server('Failed to fetch course detail');
  }
}
