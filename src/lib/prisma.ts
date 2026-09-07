import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  let dbUrl = process.env.DATABASE_URL || "mysql://u402587352_techtomorrow:TechTomorrow2026@82.25.121.209:3306/u402587352_techtomorrow?connection_limit=10&pool_timeout=30&connect_timeout=30";

  // Ensure connection parameters
  try {
    const url = new URL(dbUrl);
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '10');
    }
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', '30');
    }
    if (!url.searchParams.has('connect_timeout')) {
      url.searchParams.set('connect_timeout', '30');
    }
    dbUrl = url.toString();
  } catch (e) {
    // URL parsing fallback
  }

  return new PrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
