export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = teacherStore.getAnnouncements();
    return API.ok(data, 'Announcements retrieved successfully');
  } catch (error) {
    console.error('❌ Announcements GET Failure:', error);
    return API.server('Failed to fetch announcements');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.message) {
      return API.badRequest('Announcement title and message are required');
    }

    const newAnnouncement = teacherStore.createAnnouncement(body);
    return API.created(newAnnouncement, 'Announcement broadcast to trainees successfully');
  } catch (error) {
    console.error('❌ Announcements POST Failure:', error);
    return API.server('Failed to post announcement');
  }
}
