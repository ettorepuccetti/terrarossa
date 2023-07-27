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

      deleteAllReservationOfClub(clubId: string): Chainable<void>;

      getUsername(): Chainable<string>;
    }
  }
}
