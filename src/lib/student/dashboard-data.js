import { studentStore } from './studentStore';

/**
 * Student Dashboard Data Aggregation Utility
 * Corresponds to Tech Tomorrow's /api/student/dashboard aggregation layer
 */
export async function getStudentDashboardData() {
  try {
    const data = studentStore.getDashboardData();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[SARTHI Student Dashboard Error]:', error);
    return {
      success: false,
      error: 'Failed to aggregate student dashboard data',
    };
  }
}
