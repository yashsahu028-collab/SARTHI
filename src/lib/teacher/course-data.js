import { teacherStore } from './teacherStore';

/**
 * Teacher Course Data Utility
 * Corresponds to Tech Tomorrow's lib/teacher/course-data.ts
 */
export async function getTeacherCourses(params = {}) {
  try {
    const result = teacherStore.getCourses(params);
    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error('[SARTHI Teacher Courses Error]:', error);
    return {
      success: false,
      courses: [],
      error: 'Failed to fetch teacher courses',
    };
  }
}
