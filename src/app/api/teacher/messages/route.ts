import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateTeacher } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userId = await authenticateTeacher(req);
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get('recipient_id');

    const messages = await prisma.inboxMessage.findMany({
      where: {
        OR: [
          { senderId: userId, ...(recipientId ? { recipientId } : {}) },
          { recipientId: userId, ...(recipientId ? { senderId: recipientId } : {}) },
        ],
      },
      orderBy: { sentAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, image: true, avatar_url: true } },
        recipient: { select: { id: true, name: true, image: true, avatar_url: true } },
      },
    });

    // Group into conversations
    const convMap = new Map<string, any>();
    messages.forEach((msg) => {
      const otherUser = msg.senderId === userId ? msg.recipient : msg.sender;
      if (!otherUser) return;
      const otherId = otherUser.id;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          id: `conv-${otherId}`,
          recipientId: otherId,
          studentName: otherUser.name || 'Enrolled Trainee',
          studentAvatar: otherUser.image || otherUser.avatar_url || '/images/student-img-1.jpg',
          division: 'Numerical Weather Prediction (NWP)',
          topic: msg.subject || 'Course Inquiries & Lab Guidance',
          lastMessage: msg.body,
          lastTime: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unreadCount: (msg.recipientId === userId && !msg.isRead) ? 1 : 0,
          messages: [],
        });
      }
      const conv = convMap.get(otherId);
      conv.messages.push({
        id: msg.id,
        sender: msg.senderId === userId ? 'trainer' : 'student',
        text: msg.body,
        timestamp: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      conv.lastMessage = msg.body;
      conv.lastTime = new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const conversations = Array.from(convMap.values());

    return NextResponse.json({
      success: true,
      data: { conversations, messages },
      conversations,
      messages
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await authenticateTeacher(req);
    const body = await req.json();
    let { recipientId, conversationId, courseId, subject, body: messageBody, text } = body;

    const actualText = messageBody || text;
    if (!actualText) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    if (!recipientId && conversationId) {
      recipientId = conversationId.replace('conv-', '');
    }

    if (!recipientId) {
      // Fallback to student Mohit Raj if recipient not specified
      recipientId = 'cmp86ntpx0000lmutor3koqmz';
    }

    const message = await prisma.inboxMessage.create({
      data: {
        senderId: userId,
        recipientId,
        courseId: courseId || null,
        subject: subject || 'Faculty Guidance & Academic Support',
        body: actualText,
      },
      include: {
        sender: { select: { id: true, name: true, image: true, avatar_url: true } },
        recipient: { select: { id: true, name: true, image: true, avatar_url: true } },
      },
    });

    return NextResponse.json({ success: true, data: message, message });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
}
