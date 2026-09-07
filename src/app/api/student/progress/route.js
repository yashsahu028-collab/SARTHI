export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = studentStore.getProgress();
    return API.ok(data, 'Student learning progress retrieved successfully');
  } catch (error) {
    console.error('❌ Student Progress GET Failure:', error);
    return API.server('Failed to fetch progress metrics');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { courseId, lessonId, progressPct } = body;

    if (!courseId || !lessonId) {
      return API.badRequest('courseId and lessonId are required');
    }

    const updated = studentStore.updateLessonProgress(courseId, lessonId, progressPct);
    if (!updated) {
      return API.notFound('Course or lesson not found');
    }

    return API.ok(updated, 'Lesson progress updated successfully');
  } catch (error) {
    console.error('❌ Student Progress POST Failure:', error);
    return API.server('Failed to update progress');
  }
}
