/// <reference types="cypress" />
import { type Club, type ClubSettings } from "@prisma/client";
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
       */
      addReservationToDB(
        startDate: Date,
        endDate: Date,
        clubId: string,
        courtName: string,
        userMail: string
      ): void;

      waitForCalendarPageToLoad(): void;

      /**
       * Click on the selected slot in the calendar. The slot is identified by crossing the coordinates of the slot time and the court name
       * @param courtName display name of the court
       * @param hour start time of the slot in the format HH:mm
       */
      clickOnCalendarSlot(
        courtName: string,
        hour: number,
        minute: number
      ): void;

      getClubSettings(clubId: string): Chainable<ClubSettings>;

      /**
       * Logout to the application using logout callback.
       * It store the session using cypress so that it can switch from logged out to logged in state without having to login again
       */
      logout(): void;

      /**
       * Delete a reservation from the database
       * The command does not refresh the page, so the reservation will still be displayed in the calendar
       * @param reservationId id of the reservation to delete
       */
      deleteReservationFromDb(reservationId: string): void;
    }
  }
}
