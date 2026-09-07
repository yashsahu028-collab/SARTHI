export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = teacherStore.getAnalytics();
    return API.ok(data, 'Teacher analytics aggregated successfully');
  } catch (error) {
    console.error('❌ Analytics GET Failure:', error);
    return API.server('Failed to fetch analytics');
  }
}
