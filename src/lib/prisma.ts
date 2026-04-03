import { PrismaClient } from '@/generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// In Railway production, use the internal URL (DATABASE_PRIVATE_URL) for best performance.
// Fall back to DATABASE_URL for local development.
const connectionString =
  process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL || ''

if (!connectionString) {
  throw new Error('No database connection string found. Set DATABASE_URL or DATABASE_PRIVATE_URL.')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
