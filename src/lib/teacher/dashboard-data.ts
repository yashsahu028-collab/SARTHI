import { prisma } from '@/lib/prisma';
import { cacheData } from '@/lib/redis';

/**
 * High-performance Teacher Dashboard Data Utility
 * Implements Redis caching and parallelized database aggregation.
 */
export async function getTeacherDashboardData(userId: string, userEmail?: string, userName?: string) {
  try {
    // 1. Resolve active user ID by querying by ID first, then fallback to email lookup
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true }
    });

    if (!dbUser && userEmail) {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true, role: true, email: true }
      });
    }

    // If still not found, and we have email, auto-create the user
    if (!dbUser && userEmail && userEmail.endsWith('@techtomorrow.in')) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: userId,
            email: userEmail,
            name: userName || 'Teacher',
            role: 'TEACHER',
            status: 'ACTIVE',
            onboarded: true
          },
          select: { id: true, role: true, email: true }
        });
      } catch (err) {
        console.error('[Teacher Dashboard] Failed to create user:', err);
      }
    }

    const activeUserId = dbUser ? dbUser.id : userId;

    // Cache stats for 5 minutes based on solved activeUserId
    const data = await cacheData(`teacher:dashboard:stats:${activeUserId}`, async () => {
      // 2. Get teacher profile ID
      let teacher = await prisma.teacher.findUnique({
        where: { userId: activeUserId },
        select: { id: true }
      });

      if (!teacher && dbUser && (dbUser.role === 'TEACHER' || dbUser.email?.endsWith('@techtomorrow.in'))) {
        try {
          teacher = await prisma.teacher.create({
            data: {
              userId: activeUserId,
              title: 'Expert Mentor',
              status: 'approved',
              canCreateCourses: true
            },
            select: { id: true }
          });
        } catch (createError) {
          console.error('[Teacher Dashboard] Failed to auto-create teacher profile:', createError);
        }
      }

      if (!teacher) return null;

      const teacherId = teacher.id;
      const courseQueryFilter = {
        OR: [
          { instructorId: activeUserId },
          { teacherId: teacherId }
        ]
      };

      // 3. Multi-aggregation layer using activeUserId & teacherId
      const [
        totalStudents,
        courseStats,
        revenueStats,
        recentEnrollments
      ] = await Promise.all([
        // Total students across all courses
        prisma.enrollment.count({
          where: { course: courseQueryFilter }
        }),
        // Course counts and status distribution
        prisma.course.groupBy({
          by: ['isPublished'],
          where: courseQueryFilter,
          _count: true
        }),
        // Revenue aggregation
        prisma.transaction.aggregate({
          where: { course: courseQueryFilter, status: 'succeeded' },
          _sum: { amount: true }
        }),
        // Last 5 student activities
        prisma.enrollment.findMany({
          where: { course: courseQueryFilter },
          include: {
            user: { select: { name: true, image: true, email: true } },
            course: { select: { title: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        })
      ]);

      // 4. Transform data for UI
      const publishedCount = courseStats.find(s => s.isPublished)?._count || 0;
      const draftCount = courseStats.find(s => !s.isPublished)?._count || 0;

      const stats = {
        totalStudents,
        totalCourses: publishedCount + draftCount,
        activeCourses: publishedCount,
        totalRevenue: Number(revenueStats._sum.amount || 0),
        activeLearners: totalStudents,
        revenueGrowth: 8,
        learnersGrowth: 12,
        engagementRate: 78,
        engagementGrowth: 5,
        completionRate: 64,
        completionGrowth: 2,
        avgRating: 4.8 
      };

      const teacherProfile = {
        id: teacher.id,
        name: dbUser?.name || 'Mohit Raj',
        email: dbUser?.email || 'mohitraj8503.edu@gmail.com',
        title: teacher.title || 'Senior Instructor & Lead Specialist',
        division: 'Advanced Technology & Enterprise Learning',
        avatar: dbUser?.image || '/images/student-img-1.jpg',
        badge: 'LEAD INSTRUCTOR',
        activeCoursesCount: publishedCount,
        totalStudentsCount: totalStudents,
        averageRating: 4.9,
        totalReviews: 48,
        pendingEvaluationsCount: 0,
        scheduledLiveCount: 2,
        completionRate: '94.2%',
      };

      return {
        teacher: teacherProfile,
        stats,
        recentActivity: recentEnrollments.map(e => ({
          id: e.id,
          studentName: e.user?.name || 'Anonymous Student',
          studentImage: e.user?.image,
          courseName: e.course.title,
          timestamp: e.createdAt.toISOString(),
          type: 'enrollment'
        }))
      };
    }, 300);

    return { success: !!data, data };
  } catch (error) {
    console.error('[Teacher Dashboard Data Error]:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}
