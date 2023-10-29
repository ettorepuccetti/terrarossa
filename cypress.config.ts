import { PrismaClient } from "@prisma/client";
import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export default defineConfig({
  projectId: "y4edyf",
  e2e: {
    retries: {
      runMode: 1,
      openMode: 0,
    },
    supportFile: "cypress/support/e2e.ts",
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    watchForFileChanges: false,
    env: {
      // DATABASE_URL: process.env.DATABASE_URL,
      // NEXT_PUBLIC_APP_ENV: "test",
      // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      // AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      // AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
      // AUTH0_ISSUER: process.env.AUTH0_ISSUER,
      // AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    },
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--blink-settings=primaryPointerType=4");
          return launchOptions;
        }
      });
      tasks(on);
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

function tasks(on: Cypress.PluginEvents) {
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
      return await prisma.user.findUniqueOrThrow({
        where: {
          email: username,
        },
      });
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
    async "prisma:getClubSettings"(clubSettingsId: string) {
      return await prisma.clubSettings.findUniqueOrThrow({
        where: {
          id: clubSettingsId,
        },
      });
    },
    async "prisma:deleteReservationFromDb"(reservationId: string) {
      return await prisma.reservation.delete({
        where: {
          id: reservationId,
        },
      });
    },
  });
}
