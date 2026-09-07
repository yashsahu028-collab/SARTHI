export const dynamic = 'force-dynamic';

import { studentStore } from '@/lib/student/studentStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = studentStore.getQuizzes();
    return API.ok(data, 'Student quizzes retrieved successfully');
  } catch (error) {
    console.error('❌ Student Quizzes GET Failure:', error);
    return API.server('Failed to fetch quizzes');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { quizId, answers } = body;

    if (!quizId || !Array.isArray(answers)) {
      return API.badRequest('quizId and answers array are required');
    }

    const result = studentStore.submitQuizAttempt(quizId, answers);
    if (!result) {
      return API.notFound('Quiz not found');
    }

    return API.ok(result, 'Quiz submitted and evaluated successfully');
  } catch (error) {
    console.error('❌ Student Quiz POST Failure:', error);
    return API.server('Failed to evaluate quiz');
  }
}
