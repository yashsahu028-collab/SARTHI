export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = studentStore.getLiveClasses();
    return API.ok(data, 'Live classes retrieved successfully');
  } catch (error) {
    console.error('❌ Student Live GET Failure:', error);
    return API.server('Failed to fetch live classes');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { liveId } = body;

    if (!liveId) {
      return API.badRequest('liveId is required');
    }

    const registered = studentStore.registerLiveClass(liveId);
    if (!registered) {
      return API.notFound('Live class not found');
    }

    return API.ok(registered, 'Registered for Live Masterclass successfully');
  } catch (error) {
    console.error('❌ Student Live Registration Failure:', error);
    return API.server('Failed to register for live class');
  }
}
