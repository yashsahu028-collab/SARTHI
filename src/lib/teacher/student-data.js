import { teacherStore } from './teacherStore';

/**
 * Teacher Student Data Utility
 * Corresponds to Tech Tomorrow's lib/teacher/student-data.ts
 */
export async function getTeacherStudents(params = {}) {
  try {
    const result = teacherStore.getStudents(params);
    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error('[SARTHI Teacher Students Error]:', error);
    return {
      success: false,
      students: [],
      error: 'Failed to fetch teacher student data',
    };
  }
}
