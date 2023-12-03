import { type Club } from "@prisma/client";
import { UserRoles } from "~/utils/constants";

export interface User {
  type: UserRoles.ADMIN | UserRoles.USER;
  mail: string;
  password: string;
}

export const USER1: User = {
  type: UserRoles.USER,
  mail: Cypress.env("USER1_MAIL") as string,
  password: Cypress.env("USER1_PWD") as string,
};

export const ADMIN_FORO: User = {
  type: UserRoles.ADMIN,
  mail: Cypress.env("ADMIN_FORO_MAIL") as string,
  password: Cypress.env("ADMIN_FORO_PWD") as string,
};

export function saveClubInfoAndCleanReservations(
  clubName: string,
  clubIdAliasName: string,
  clubAliasName: string,
  clubSettingsAliasName: string,
) {
  cy.queryFilteredClubs(clubName).then(function (clubs: Club[]) {
    if (clubs[0] === undefined) {
      throw new Error("No clubs found");
    }
    cy.wrap(clubs[0]).as(clubAliasName);
    cy.wrap(clubs[0].id)
      .as(clubIdAliasName)
      .then(() => {
        if (clubs[0] === undefined) {
          //already checked, but build fails otherwise
          throw new Error("No clubs found");
        }
        cy.deleteAllReservationOfClub(clubs[0].id);
      });

    cy.getClubSettings(clubs[0].clubSettingsId).then((clubSettings) => {
      cy.wrap(clubSettings).as(clubSettingsAliasName);
    });
  });
}

export function loginAndVisitCalendarPage(
  mail: string,
  pwd: string,
  clubId: string,
) {
  cy.loginToAuth0(mail, pwd);
  cy.visit(`/prenota?clubId=${clubId}`).waitForCalendarPageToLoad();
}

export function loginAndVisitProfilePage(mail: string, pwd: string) {
  cy.loginToAuth0(mail, pwd);
  cy.visit(`/profile`)
    .getByDataTest("profile-page-initial-loading")
    .should("not.exist");
}
