import { PrismaClient } from "@prisma/client";
import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    watchForFileChanges: false,
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: "test",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
      AUTH0_ISSUER: process.env.AUTH0_ISSUER,
      AUTH0_BASE_URL: process.env.AUTH_BASE_URL,
    },
    setupNodeEvents(on, config) {
      //TODO: figure out how to use trpc in cypress

      // async function queryClubs(): Promise<Club[]> {
      // const client = createTRPCProxyClient<AppRouter>({
      //   transformer: superjson,
      //   links: [
      //     loggerLink({ enabled: () => true }),
      //     httpBatchLink({
      //       url: "http://localhost:3000/trpc",
      //     }),
      //   ],
      // });
      // const result = await client.club.getAll.query();
      // }

      const prisma = new PrismaClient();

      on("task", {
        "prisma:queryClubs"() {
          return prisma.club.findMany();
        },
        "prisma:queryFilteredClubs"(filter: string) {
          return prisma.club.findMany({
            where: {
              name: {
                contains: filter,
              },
            },
          });
        },
        "prisma:deleteAllReservationOfClub"(clubId: string) {
          return prisma.reservation.deleteMany({
            where: {
              court: {
                clubId: clubId,
              },
            },
          });
        },
      });
      return config;
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
