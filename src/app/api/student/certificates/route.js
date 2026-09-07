export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = studentStore.getCertificates();
    return API.ok(data, 'Student certificates retrieved successfully');
  } catch (error) {
    console.error('❌ Student Certificates GET Failure:', error);
    return API.server('Failed to fetch certificates');
  }
}
