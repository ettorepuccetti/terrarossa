import { defineConfig } from "cypress";
import dotenv from "dotenv";
import { cypressDb } from "./cypress/support/db";

dotenv.config();

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
    "prisma:queryClubs"() {
      return cypressDb.queryClubs();
    },
    "prisma:queryFilteredClubs"(filter: string) {
      return cypressDb.queryFilteredClubs(filter);
    },
    "prisma:deleteAllReservationOfClub"(clubId: string) {
      if (!clubId) throw new Error("clubId is undefined");
      return cypressDb.deleteAllReservationsOfClub(clubId);
    },
    "prisma:getUserIdFromUsername"(username: string) {
      return cypressDb.getUserByEmail(username);
    },
    "prisma:makeReservation"({
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
      return cypressDb.createReservation({
        startTime,
        endTime,
        clubId,
        courtName,
        userMail,
      });
    },
    "prisma:getClubSettings"(clubSettingsId: string) {
      return cypressDb.getClubSettingsById(clubSettingsId);
    },
    "prisma:deleteReservationFromDb"(reservationId: string) {
      return cypressDb.deleteReservation(reservationId);
    },
    "prisma:editUsername"({
      userMail,
      newUsername,
    }: {
      userMail: string;
      newUsername: string;
    }) {
      return cypressDb.editUsername(userMail, newUsername);
    },
  });
}
