export const dynamic = 'force-dynamic';

import { getTeacherDashboardData } from '@/lib/teacher/dashboard-data';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const result = await getTeacherDashboardData();
    if (result.success && result.data) {
      return API.ok(result.data, 'Teacher dashboard data loaded successfully');
    }
    return API.err('Failed to aggregate teacher dashboard data', 'DEGRADED_DASHBOARD', 503);
  } catch (error) {
    console.error('❌ Dashboard API Failure:', error);
    return API.server('Teacher dashboard data engine failure');
  }
}
