import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateTeacher } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateTeacher(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, role: true }
    });

    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      select: { id: true, title: true, bio: true, expertise: true, teacherEmail: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: teacher?.id || userId,
        userId,
        name: user?.name || 'Dr. Mohit Raj',
        email: user?.email || 'mohitraj8503.edu@gmail.com',
        title: teacher?.title || 'Senior Instructor & Lead Specialist',
        division: teacher?.expertise || 'Advanced Technology & Enterprise Learning',
        avatar: user?.image || '/images/student-img-1.jpg',
        bio: teacher?.bio || 'Leading meteorological training and enterprise analytics cohorts.',
      }
    });
  } catch (error: any) {
    console.error('[Settings GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await authenticateTeacher(request);
    const body = await request.json();
    const { name, title, division, bio } = body;

    // Update User name
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name }
      });
    }

    // Update Teacher record
    await prisma.teacher.upsert({
      where: { userId },
      update: {
        ...(title ? { title } : {}),
        ...(division ? { expertise: division } : {}),
        ...(bio ? { bio } : {}),
      },
      create: {
        userId,
        title: title || 'Senior Instructor & Lead Specialist',
        expertise: division || 'Advanced Technology & Enterprise Learning',
        bio: bio || '',
        status: 'approved',
        canCreateCourses: true,
      }
    });

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('[Settings PATCH] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
