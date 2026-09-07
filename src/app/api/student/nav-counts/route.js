export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = studentStore.getNavCounts();
    return API.ok(data, 'Student navigation badge counts retrieved successfully');
  } catch (error) {
    console.error('❌ Student Nav Counts GET Failure:', error);
    return API.server('Failed to fetch navigation counts');
  }
}
