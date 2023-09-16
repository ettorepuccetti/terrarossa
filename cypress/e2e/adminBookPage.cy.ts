import { type ClubSettings } from "@prisma/client";
import dayjs from "dayjs";
import {
  allEnglandClubName,
  centralCourtName,
  foroItalicoName,
  pietrangeliCourtName,
} from "~/utils/constants";
import {
  loginAndVisitCalendarPage,
  saveClubInfoAndCleanReservations,
} from "./constants";

beforeEach("Retrieve clubs, delete reservations and login", function () {
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

  it("GIVEN admin WHEN override reservation name THEN new name is visible", function () {
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=overwriteName").type("John Doe");
    cy.get("[data-test=reserveButton]").click();
    cy.get("[data-test=calendar-event]").should("contain.text", "John Doe");
  });

  it("GIVEN admin WHEN reserve in the past THEN can reserve", function () {
    cy.navigateDaysFromToday(-1);
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=past-warning").should("not.exist");
    cy.get("[data-test=reserveButton]").click();
    cy.get("[data-test=calendar-event]").should("be.visible");
  });

  it("GIVEN admin WHEN exceed max active reservations THEN can reserve", function () {
    const startDate = dayjs().add(2, "day").hour(12).minute(0);

    // reach the max number of reservations
    for (
      let i = 0;
      i < (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser;
      i++
    ) {
      cy.addReservationToDB(
        startDate.add(i, "hour").toDate(),
        startDate.add(i + 1, "hour").toDate(),
        this.clubIdForoItalico as string,
        i % 2 === 0 ? pietrangeliCourtName : centralCourtName,
        Cypress.env("ADMIN_FORO_MAIL") as string
      );
    }
    // check that all reservation have been added
    cy.reload();
    cy.waitForCalendarPageToLoad();
    cy.navigateDaysFromToday(2);
    cy.get("[data-test='calendar-event']").should(
      "have.length",
      (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser
    );

    // try to add another reservation
    cy.navigateDaysFromToday(3);
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=reserveButton]").click();
    cy.get("[data-test=calendar-event]").should("be.visible");
  });
});

describe("Existing reservation", () => {
  it.only("GIVEN admin WHEN click on other's reservation THEN can delete", function () {
    const startDate = dayjs().add(2, "day").hour(12).minute(0);

    cy.addReservationToDB(
      startDate.toDate(),
      startDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER1_MAIL") as string
    );

    cy.reload().waitForCalendarPageToLoad();
    cy.navigateDaysFromToday(2);
    cy.get("[data-test=calendar-event]").click();
    cy.get("[data-test=delete-button]").click();
    cy.get("[data-test=confirm-button]").click();

    cy.get("[data-test=calendar-event]").should("not.exist");
  });
});
