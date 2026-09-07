export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { teacherStore } from '@/lib/teacher/teacherStore';
import { API } from '@/lib/teacher/apiResponse';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = teacherStore.getCourses({ search, category, status, page, limit });
    return API.ok(result, 'Courses retrieved successfully');
  } catch (error) {
    console.error('❌ Teacher Courses GET Failure:', error);
    return API.server('Failed to fetch teacher courses');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return API.badRequest('Course title is required');
    }

    const newCourse = teacherStore.createCourse(body);
    return API.created(newCourse, 'Course created successfully');
  } catch (error) {
    console.error('❌ Teacher Courses POST Failure:', error);
    return API.server('Failed to create course');
  }
}
