export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function POST(request) {
  try {
    const result = teacherStore.startQuickLive();
    return API.ok(result, 'Quick live session initialized');
  } catch (error) {
    console.error('❌ Quick Live Session Failure:', error);
    return API.server('Failed to start quick live session');
  }
}
