export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = teacherStore.getStudents({ search, status, page, limit });
    return API.ok(result, 'Trainees list retrieved successfully');
  } catch (error) {
    console.error('❌ Students GET Failure:', error);
    return API.server('Failed to fetch students data');
  }
}
