import { NextRequest, NextResponse } from 'next/server';
import { authenticateTeacher } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateTeacher(request);

    const liveClasses = await prisma.liveClass.findMany({
      where: {
        teacherId: userId,
      },
      select: {
        id: true,
        courseId: true,
        title: true,
        description: true,
        scheduledAt: true,
        status: true,
        liveKitStatus: true,
        liveKitStartedAt: true,
        liveKitEndedAt: true,
        roomName: true,
        createdAt: true,
        course: { select: { title: true } },
        recording: {
          select: {
            recordingStatus: true,
            driveFileId: true,
            driveViewUrl: true,
            durationSec: true,
            failureReason: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, liveClasses });
  } catch (error: any) {
    console.error('[teacher/live-classes GET]', error);
    return NextResponse.json({ error: 'Failed to fetch live classes' }, { status: 500 });
  }
}
