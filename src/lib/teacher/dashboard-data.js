import { teacherStore } from './teacherStore';

/**
 * Teacher Dashboard Data Utility
 * Corresponds to Tech Tomorrow's lib/teacher/dashboard-data.ts
 */
export async function getTeacherDashboardData() {
  try {
    const data = teacherStore.getDashboardData();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[SARTHI Teacher Dashboard Error]:', error);
    return {
      success: false,
      error: 'Failed to aggregate teacher dashboard data',
    };
  }
}
