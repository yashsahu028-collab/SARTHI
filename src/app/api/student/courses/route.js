export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const status = searchParams.get('status') || 'all';

    const result = studentStore.getCourses({ search, category, status });
    return API.ok(result, 'Enrolled courses retrieved successfully');
  } catch (error) {
    console.error('❌ Student Courses GET Failure:', error);
    return API.server('Failed to fetch student courses');
  }
}
