export const dynamic = 'force-dynamic';

import { getStudentDashboardData } from '@/lib/student/dashboard-data';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const result = await getStudentDashboardData();
    if (result.success && result.data) {
      return API.ok(result.data, 'Student dashboard data loaded successfully');
    }
    return API.err('Failed to load student dashboard data', 'STUDENT_DASHBOARD_ERROR', 500);
  } catch (error) {
    console.error('❌ Student Dashboard API Failure:', error);
    return API.server('Student dashboard engine failure');
  }
}
