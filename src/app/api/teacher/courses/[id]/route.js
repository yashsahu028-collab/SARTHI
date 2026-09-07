export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const course = teacherStore.getCourseById(id);
    if (!course) {
      return API.notFound('Course not found');
    }
    return API.ok(course);
  } catch (error) {
    console.error('❌ Teacher Course GET Failure:', error);
    return API.server('Failed to fetch course details');
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = teacherStore.updateCourse(id, body);
    if (!updated) {
      return API.notFound('Course not found');
    }
    return API.ok(updated, 'Course updated successfully');
  } catch (error) {
    console.error('❌ Teacher Course PATCH Failure:', error);
    return API.server('Failed to update course');
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = teacherStore.deleteCourse(id);
    if (!success) {
      return API.notFound('Course not found');
    }
    return API.ok({ id }, 'Course deleted successfully');
  } catch (error) {
    console.error('❌ Teacher Course DELETE Failure:', error);
    return API.server('Failed to delete course');
  }
}
