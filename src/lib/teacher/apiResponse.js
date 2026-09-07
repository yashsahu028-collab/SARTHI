import { NextResponse } from 'next/server';

export const API = {
  ok: (data, message = 'Success', meta = {}) => {
    return NextResponse.json({
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  },

  created: (data, message = 'Created successfully') => {
    return NextResponse.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  },

  err: (message = 'An error occurred', code = 'ERROR', status = 400, extra = {}) => {
    return NextResponse.json({
      success: false,
      error: message,
      code,
      ...extra,
      timestamp: new Date().toISOString(),
    }, { status });
  },

  badRequest: (message = 'Bad request', extra = {}) => {
    return NextResponse.json({
      success: false,
      error: message,
      code: 'BAD_REQUEST',
      ...extra,
      timestamp: new Date().toISOString(),
    }, { status: 400 });
  },

  unauthorized: (message = 'Unauthorized access') => {
    return NextResponse.json({
      success: false,
      error: message,
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString(),
    }, { status: 401 });
  },

  forbidden: (message = 'Forbidden') => {
    return NextResponse.json({
      success: false,
      error: message,
      code: 'FORBIDDEN',
      timestamp: new Date().toISOString(),
    }, { status: 403 });
  },

  notFound: (message = 'Resource not found') => {
    return NextResponse.json({
      success: false,
      error: message,
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
    }, { status: 404 });
  },

  server: (message = 'Internal server error') => {
    return NextResponse.json({
      success: false,
      error: message,
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  },
};
