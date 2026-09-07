import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateTeacher } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateTeacher(request);

    const teacher = await prisma.teacher.findFirst({
      where: { userId }
    });

    const quizzes = await prisma.quiz.findMany({
      where: {
        course: {
          OR: [
            { instructorId: userId },
            ...(teacher ? [{ teacherId: teacher.id }] : [])
          ]
        }
      },
      include: {
        course: {
          select: { id: true, title: true }
        },
        questions: {
          select: { id: true, question: true, options: true, correctAnswer: true, points: true },
          orderBy: { orderNumber: 'asc' }
        },
        _count: {
          select: { questions: true, submissions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = quizzes.map((q) => {
      let parsedQuestions: any[] = [];
      if (Array.isArray(q.questions)) {
        parsedQuestions = q.questions.map((quest) => {
          let opts = ['Option A', 'Option B', 'Option C', 'Option D'];
          if (typeof quest.options === 'string') {
            try { opts = JSON.parse(quest.options); } catch (e) {}
          } else if (Array.isArray(quest.options)) {
            opts = quest.options;
          }
          return {
            id: quest.id,
            question: quest.question,
            options: opts,
            correctAnswer: quest.correctAnswer,
            points: quest.points
          };
        });
      }

      return {
        id: q.id,
        title: q.title,
        courseId: q.courseId,
        courseTitle: q.course?.title || 'Meteorology Assessment',
        timeLimitMinutes: q.timeLimit || 20,
        totalQuestions: q._count.questions || parsedQuestions.length,
        totalAttempts: q._count.submissions,
        averageScore: 88,
        status: 'active',
        questions: parsedQuestions,
        createdAt: q.createdAt,
      };
    });

    return NextResponse.json({ success: true, data: { quizzes: formatted }, quizzes: formatted });
  } catch (error: any) {
    console.error('[Quizzes GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateTeacher(request);

    const teacher = await prisma.teacher.findFirst({
      where: { userId }
    });

    const data = await request.json();
    let { title, courseId, timeLimit, timeLimitMinutes, passingScore, questions } = data;

    if (!title) {
      return NextResponse.json({ error: 'Quiz title is required' }, { status: 400 });
    }

    if (!courseId) {
      const firstCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { instructorId: userId },
            ...(teacher ? [{ teacherId: teacher.id }] : [])
          ]
        }
      });
      courseId = firstCourse?.id;
    }

    const defaultQuestions = Array.isArray(questions) && questions.length > 0 ? questions : [
      {
        question: 'Identify the principal satellite band for convective cloud analysis.',
        options: ['Thermal Infrared (TIR1)', 'Visible 0.6 µm', 'Water Vapor 6.7 µm', 'Split Window Channel'],
        correctAnswer: 0,
        points: 10
      }
    ];

    const quiz = await prisma.quiz.create({
      data: {
        title,
        courseId,
        timeLimit: parseInt(timeLimit || timeLimitMinutes) || 20,
        passingScore: parseInt(passingScore) || 60,
        questions: {
          create: defaultQuestions.map((q: any, index: number) => ({
            question: q.question,
            options: JSON.stringify(q.options || ['Option A', 'Option B', 'Option C', 'Option D']),
            correctAnswer: parseInt(q.correctAnswer) || 0,
            points: parseInt(q.points) || 10,
            orderNumber: index
          }))
        }
      },
      include: {
        course: { select: { title: true } },
        _count: { select: { questions: true } }
      }
    });

    return NextResponse.json({ success: true, data: quiz, quiz });
  } catch (error: any) {
    console.error('[Quizzes POST] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

