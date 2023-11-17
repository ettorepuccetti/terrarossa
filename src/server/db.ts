import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "~/env.mjs";

function makePrisma() {
  return new PrismaClient({
    datasources: { db: { url: env.ACCELERATE_URL } },
  }).$extends(withAccelerate());
}

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof makePrisma>;
};

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = makePrisma();
