import {
  allEnglandClubName,
  foroItalicoName,
  pietrangeliCourtName,
} from "~/utils/constants";
import {
  loginAndVisitCalendarPage,
  saveClubInfoAndCleanReservations,
} from "./constants";

beforeEach("Initial clean up and retrieve Clubs", function () {
  saveClubInfoAndCleanReservations(
    foroItalicoName,
    "clubIdForoItalico",
    "foroItalico",
    "clubSettingsForoItalico"
  );
  saveClubInfoAndCleanReservations(
    allEnglandClubName,
    "clubIdAllEngland",
    "allEngland",
    "clubSettingsAllEngland"
  );

  // so I can use previous aliases
  cy.then(() => {
    loginAndVisitCalendarPage(
      Cypress.env("ADMIN_FORO_MAIL") as string,
      Cypress.env("ADMIN_FORO_PWD") as string,
      this.clubIdForoItalico as string
    );
  });
});

describe("New reservation", () => {
  it("GIVEN admin WHEN reserve more than 2 hours THEN can reserve", function () {
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=endTime]").type("15:00");
    cy.get("[data-test=endTime")
      .should("have.value", "15:00")
      .and("have.attr", "aria-invalid", "false");
    cy.get("[data-test=reserveButton]").click();
    cy.get("[data-test=calendar-event]").should("be.visible");
  });
});
