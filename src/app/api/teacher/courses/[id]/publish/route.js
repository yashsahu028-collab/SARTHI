export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const course = teacherStore.toggleCoursePublish(id);
    if (!course) {
      return API.notFound('Course not found');
    }
    return API.ok({
      id: course.id,
      isPublished: course.isPublished,
      status: course.status,
    }, `Course ${course.isPublished ? 'published' : 'moved to drafts'} successfully`);
  } catch (error) {
    console.error('❌ Course Publish Failure:', error);
    return API.server('Failed to toggle course publication status');
  }
}
