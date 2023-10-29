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
      AUTH0_ISSUER: process.env.AUTH0_ISSUER,
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
