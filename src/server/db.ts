import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "~/env.mjs";

export const prisma = new PrismaClient({
  log:
    env.NEXT_PUBLIC_APP_ENV === "production"
      ? ["error"]
      : ["error", "query", "warn"],
}).$extends(withAccelerate());
