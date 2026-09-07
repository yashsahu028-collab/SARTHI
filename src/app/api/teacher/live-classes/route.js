export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = teacherStore.getLiveClasses();
    return API.ok(data, 'Live classes retrieved successfully');
  } catch (error) {
    console.error('❌ Live Classes GET Failure:', error);
    return API.server('Failed to fetch live classes');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return API.badRequest('Live session title is required');
    }

    const newLive = teacherStore.createLiveClass(body);
    return API.created(newLive, 'Live studio masterclass scheduled successfully');
  } catch (error) {
    console.error('❌ Live Classes POST Failure:', error);
    return API.server('Failed to schedule live class');
  }
}
