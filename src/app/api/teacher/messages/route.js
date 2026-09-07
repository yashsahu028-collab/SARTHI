export const dynamic = 'force-dynamic';

import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET() {
  try {
    const data = teacherStore.getMessages();
    return API.ok(data, 'Messages retrieved successfully');
  } catch (error) {
    console.error('❌ Messages GET Failure:', error);
    return API.server('Failed to fetch messages');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { conversationId, text } = body;
    if (!conversationId || !text || !text.trim()) {
      return API.badRequest('conversationId and text are required');
    }

    const newMsg = teacherStore.createMessage(conversationId, { text, sender: 'trainer' });
    if (!newMsg) {
      return API.notFound('Conversation not found');
    }

    return API.created(newMsg, 'Message sent successfully');
  } catch (error) {
    console.error('❌ Messages POST Failure:', error);
    return API.server('Failed to send message');
  }
}
