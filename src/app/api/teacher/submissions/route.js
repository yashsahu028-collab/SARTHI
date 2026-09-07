export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const courseId = searchParams.get('courseId') || '';

    const data = teacherStore.getSubmissions({ status, search, courseId });
    return API.ok(data, 'Submissions retrieved successfully');
  } catch (error) {
    console.error('❌ Submissions GET Failure:', error);
    return API.server('Failed to fetch submissions');
  }
}
