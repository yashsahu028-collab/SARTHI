export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudent } from '@/lib/auth/middleware';
import { API } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateStudent(request);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const status = searchParams.get('status') || 'all';
    const enrolledOnly = searchParams.get('enrolled') === 'true';

    const where: any = {
      isPublished: true,
    };

    if (enrolledOnly) {
      where.enrollments = {
        some: { userId },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category && category !== 'All') {
      where.category = { contains: category };
    }

    const courses = await prisma.course.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });

    const transformed = courses.map((c) => {
      const enrollment = c.enrollments?.[0];
      const isEnrolled = Boolean(enrollment);
      const progress = enrollment?.progressPercentage || 0;
      const totalLessons = c.lessons?.length || 10;
      const completedLessons = Math.round((progress / 100) * totalLessons);

      let courseStatus = 'not-started';
      if (progress === 100) courseStatus = 'completed';
      else if (progress > 0 || isEnrolled) courseStatus = 'active';

      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        category: c.Category?.name || c.category || 'General',
        level: c.level || 'Beginner to Advanced',
        thumbnail: c.thumbnail || c.course_thumbnail_url || '/courses/default.png',
        price: Number(c.price || 0),
        instructor: {
          name: c.instructor?.name || 'Faculty Specialist',
          avatar: c.instructor?.avatar_url || c.instructor?.image || '/images/student-img-1.jpg',
        },
        totalLessons,
        completedLessons,
        progress,
        durationHours: c.duration ? Math.round(c.duration / 60) : 16,
        status: courseStatus,
        isBookmarked: false,
        isEnrolled,
        enrolledStudentsCount: c.enrolledStudentsCount || 0,
      };
    });

    let filtered = transformed;
    if (status === 'active') {
      filtered = transformed.filter((c) => c.status === 'active');
    } else if (status === 'completed') {
      filtered = transformed.filter((c) => c.status === 'completed');
    }

    return API.ok({
      courses: filtered,
      count: filtered.length,
      totalCount: transformed.length,
    }, 'Courses retrieved successfully from database');
  } catch (error: any) {
    console.error('❌ Student Courses Database GET Failure:', error);
    return API.server('Failed to fetch courses from database');
  }
}
