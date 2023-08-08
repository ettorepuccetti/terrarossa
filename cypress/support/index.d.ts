/// <reference types="cypress" />
import { type Club } from "@prisma/client";
import "./commands";

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      loginToAuth0(username: string, password: string): void;

      queryClubs(): Chainable<Club[]>;

      queryFilteredClubs(filter: string): Chainable<Club[]>;

      deleteAllReservationOfClub(clubId: string): void;

      getUsername(): Chainable<string>;

      /**
       * In the calendar page, click on the dateCard to select a date `n` days in the future or in the past (if `n` is negative)
       * @param n Number of days from today to navigate to (negative to go in the past)
       */
      navigateDaysFromToday(n: number): void;
    }
  }
}
