export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = teacherStore.getNotifications();
    return API.ok(data, 'Notifications retrieved successfully');
  } catch (error) {
    console.error('❌ Notifications GET Failure:', error);
    return API.server('Failed to fetch notifications');
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return API.badRequest('Notification id is required');
    }

    const updated = teacherStore.markNotificationRead(id);
    if (!updated) {
      return API.notFound('Notification not found');
    }

    return API.ok(updated, 'Notification marked as read');
  } catch (error) {
    console.error('❌ Notifications PATCH Failure:', error);
    return API.server('Failed to update notification');
  }
}
