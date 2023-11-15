import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "~/env.mjs";

export const prisma =
  env.NEXT_PUBLIC_APP_ENV === "production"
    ? new PrismaClient({ log: ["error"] }).$extends(withAccelerate())
    : new PrismaClient({ log: ["error", "query", "warn"] });
