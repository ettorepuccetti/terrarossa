import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "~/generated/prisma/client";

dotenv.config();

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

const prisma = new PrismaClient({ adapter });

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
    resolvedNodeVersion: "system",
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
    retries: {
      runMode: 1,
      openMode: 0,
    },
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
    async "prisma:deleteAllReservationOfClub"(clubId: string) {
      if (!clubId) throw new Error("clubId is undefined");
      await prisma.reservation.deleteMany({
        where: {
          court: {
            clubId: clubId,
          },
        },
      });
      return await prisma.recurrentReservation.deleteMany({
        where: {
          reservations: {
            every: {
              court: {
                clubId: clubId,
              },
            },
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

    async "prisma:editUsername"({
      userMail,
      newUsername,
    }: {
      userMail: string;
      newUsername: string;
    }) {
      return await prisma.user.update({
        data: {
          name: newUsername,
        },
        where: {
          email: userMail,
        },
      });
    },
  });
}
