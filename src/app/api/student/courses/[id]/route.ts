export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudent } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await authenticateStudent(request);
    const { id } = await params;

    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            avatar_url: true,
          },
        },
        Category: true,
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
        enrollments: {
          where: { userId },
          select: {
            id: true,
            status: true,
            progressPercentage: true,
          },
        },
      },
    });

    if (!course) {
      return API.notFound('Course not found');
    }

    const enrollment = course.enrollments?.[0];
    const isEnrolled = Boolean(enrollment);
    const progress = enrollment?.progressPercentage || 0;
    const totalLessons = course.lessons?.length || 10;
    const completedLessons = Math.round((progress / 100) * totalLessons);

    const transformed = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      category: course.Category?.name || course.category || 'General',
      level: course.level || 'Beginner to Advanced',
      thumbnail: course.thumbnail || course.course_thumbnail_url || '/courses/default.png',
      price: Number(course.price || 0),
      instructor: {
        name: course.instructor?.name || 'Faculty Specialist',
        avatar: course.instructor?.avatar_url || course.instructor?.image || '/images/student-img-1.jpg',
      },
      totalLessons,
      completedLessons,
      progress,
      durationHours: course.duration ? Math.round(course.duration / 60) : 16,
      status: progress === 100 ? 'completed' : progress > 0 || isEnrolled ? 'active' : 'not-started',
      isBookmarked: false,
      isEnrolled,
      lessons: course.lessons || [],
    };

    return API.ok(transformed, 'Course retrieved successfully');
  } catch (error: any) {
    console.error('❌ Student Course Detail GET Failure:', error);
    return API.server('Failed to fetch course detail');
  }
}
