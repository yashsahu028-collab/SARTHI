export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const course = studentStore.toggleBookmark(id);
    if (!course) {
      return API.notFound('Course not found');
    }
    return API.ok({
      id: course.id,
      isBookmarked: course.isBookmarked,
    }, `Course ${course.isBookmarked ? 'bookmarked' : 'unbookmarked'} successfully`);
  } catch (error) {
    console.error('❌ Course Bookmark Toggle Failure:', error);
    return API.server('Failed to toggle bookmark');
  }
}
