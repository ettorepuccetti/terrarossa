import { PrismaClient } from "@prisma/client";
import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  projectId: "y4edyf",
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
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--blink-settings=primaryPointerType=4");
          return launchOptions;
        }
      });
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
          if (!clubId) throw new Error("clubId is undefined");
          return prisma.reservation.deleteMany({
            where: {
              court: {
                clubId: clubId,
              },
            },
          });
        },
        async "prisma:getUserIdFromUsername"(username: string) {
          const user = await prisma.user.findUnique({
            where: {
              email: username,
            },
          });
          if (!user) throw new Error("User not found");
          return user.id;
        },
        async "prisma:makeReservation"({
          startTime,
          endTime,
          clubId,
          courtName,
          userMail,
        }: {
          startTime: Date;
          endTime: Date;
          clubId: string;
          courtName: string;
          userMail: string;
        }) {
          return await prisma.reservation.create({
            data: {
              startTime: startTime,
              endTime: endTime,
              user: {
                connect: {
                  email: userMail,
                },
              },
              court: {
                connect: {
                  name_clubId: {
                    clubId: clubId,
                    name: courtName,
                  },
                },
              },
            },
          });
        },
      });
      return config;
    },
  },

  component: {
    watchForFileChanges: false,
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
