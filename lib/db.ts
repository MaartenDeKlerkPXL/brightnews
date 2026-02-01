import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// We maken de client aan
const client = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client

// We exporteren hem onder BEIDE namen zodat elk bestand blij is
export { client as db }
export { client as prisma }