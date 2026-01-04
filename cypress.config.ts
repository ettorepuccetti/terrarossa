import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "~/generated/prisma/client";

dotenv.config();

// Initialize Prisma client for Cypress tasks with better-sqlite3 adapter
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
    async "prisma:queryClubs"() {
      return prisma.club.findMany({
        include: { clubSettings: true },
      });
    },
    async "prisma:queryFilteredClubs"(filter: string) {
      return prisma.club.findMany({
        where: {
          name: { contains: filter },
        },
        include: { clubSettings: true },
      });
    },
    async "prisma:deleteAllReservationOfClub"(clubId: string) {
      if (!clubId) throw new Error("clubId is undefined");
      // Delete reservations through the court relation
      await prisma.reservation.deleteMany({
        where: { court: { clubId } },
      });
      return null;
    },
    async "prisma:getUserIdFromUsername"(username: string) {
      const user = await prisma.user.findUnique({
        where: { email: username },
      });
      return user?.id ?? null;
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
      const user = await prisma.user.findUnique({ where: { email: userMail } });
      if (!user) throw new Error(`User not found: ${userMail}`);
      const court = await prisma.court.findFirst({
        where: { name: courtName, clubId },
      });
      if (!court) throw new Error(`Court not found: ${courtName}`);

      return prisma.reservation.create({
        data: {
          startTime,
          endTime,
          courtId: court.id,
          userId: user.id,
        },
      });
    },
    async "prisma:getClubSettings"(clubSettingsId: string) {
      return prisma.clubSettings.findUnique({
        where: { id: clubSettingsId },
      });
    },
    async "prisma:deleteReservationFromDb"(reservationId: string) {
      await prisma.reservation.delete({ where: { id: reservationId } });
      return null;
    },
    async "prisma:editUsername"({
      userMail,
      newUsername,
    }: {
      userMail: string;
      newUsername: string;
    }) {
      await prisma.user.update({
        where: { email: userMail },
        data: { name: newUsername },
      });
      return null;
    },
  });
}
