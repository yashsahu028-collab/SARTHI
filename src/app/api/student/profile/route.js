export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = studentStore.getProfile();
    return API.ok(data, 'Student profile retrieved successfully');
  } catch (error) {
    console.error('❌ Student Profile GET Failure:', error);
    return API.server('Failed to fetch profile');
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const updated = studentStore.updateSettings(body);
    return API.ok(updated, 'Profile settings updated successfully');
  } catch (error) {
    console.error('❌ Student Profile PATCH Failure:', error);
    return API.server('Failed to update profile');
  }
}
