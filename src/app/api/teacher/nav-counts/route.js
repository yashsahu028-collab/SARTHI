export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = teacherStore.getNavCounts();
    return API.ok(data, 'Navigation badge counts retrieved successfully');
  } catch (error) {
    console.error('❌ Nav Counts GET Failure:', error);
    return API.server('Failed to fetch navigation counts');
  }
}
