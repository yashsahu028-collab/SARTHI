export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudent } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await authenticateStudent(request);
    const { id } = await params;

    const course = await prisma.course.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, title: true },
    });

    if (!course) {
      return API.notFound('Course not found');
    }

    return API.ok({
      id: course.id,
      isBookmarked: true,
    }, 'Course bookmark updated successfully');
  } catch (error: any) {
    console.error('❌ Course Bookmark Toggle Failure:', error);
    return API.server('Failed to toggle bookmark');
  }
}
