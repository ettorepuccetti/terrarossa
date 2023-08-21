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

      /**
       * Insert a reservation directly in the database
       * @param {Date} startDate start date of the reservation
       * @param {Date} endDate end date of the reservation
       * @param {string} clubId clubId of the club to make the reservation for
       * @param {string} courtName name of the court to make the reservation for
       * @param {string} userMail email of the user to make the reservation for
       * @param {string} userPassword password of the user to make the reservation for
       */
      createReservation(
        startDate: Date,
        endDate: Date,
        clubId: string,
        courtName: string,
        userMail: string,
        userPassword: string
      ): void;

      waitForCalendarPageToLoad(): void;

      /**
       * Click on the selected slot in the calendar. The slot is identified by crossing the coordinates of the slot time and the court name
       * @param courtName display name of the court
       * @param hour start time of the slot in the format HH:mm
       */
      clickOnCalendarSlot(courtName: string, hour: string): void;
    }
  }
}
