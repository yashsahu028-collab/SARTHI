export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateTeacher } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const teacherId = await authenticateTeacher(request);

    const notifications = await prisma.notification.findMany({
      where: { userId: teacherId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return API.ok({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  } catch (error: any) {
    console.error('❌ Teacher Notifications Failure:', error);
    return API.server('Failed to fetch notifications');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const teacherId = await authenticateTeacher(request);
    const body = await request.json();
    const { id, all } = body;

    if (all) {
      await prisma.notification.updateMany({
        where: { userId: teacherId, isRead: false },
        data: { isRead: true },
      });
      return API.ok(null, 'All notifications marked as read');
    }

    if (id) {
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
      return API.ok(null, 'Notification marked as read');
    }

    return API.badRequest('id or all is required');
  } catch (error: any) {
    console.error('❌ Teacher Notifications PATCH Failure:', error);
    return API.server('Failed to update notifications');
  }
}
