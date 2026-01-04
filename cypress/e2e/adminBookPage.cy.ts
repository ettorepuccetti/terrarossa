import { type ClubSettings } from "../../src/generated/prisma/client";
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
} from "./_constants";

beforeEach("Retrieve clubs, delete reservations and login", function () {
  saveClubInfoAndCleanReservations(
    foroItalicoName,
    "clubIdForoItalico",
    "foroItalico",
    "clubSettingsForoItalico",
  );
  saveClubInfoAndCleanReservations(
    allEnglandClubName,
    "clubIdAllEngland",
    "allEngland",
    "clubSettingsAllEngland",
  );

  // so I can use previous aliases
  cy.then(() => {
    loginAndVisitCalendarPage(
      Cypress.env("ADMIN_FORO_MAIL") as string,
      Cypress.env("ADMIN_FORO_PWD") as string,
      this.clubIdForoItalico as string, //`clubIdForoItalico` is accessible as class field because saved with cy.wrap()
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
        Cypress.env("ADMIN_FORO_MAIL") as string,
      );
    }
    // check that all reservation have been added
    cy.refetchReservationQuery();
    cy.navigateDaysFromToday(2);
    cy.get("[data-test='calendar-event']").should(
      "have.length",
      (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser,
    );

    // try to add another reservation
    cy.navigateDaysFromToday(3);
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=reserveButton]").click();
    cy.get("[data-test=calendar-event]").should("be.visible");
  });

  it("GIVEN admin WHEN make recurrent reservation THEN reservations are created", function () {
    // check if I am not in the last two weeks of the year
    if (dayjs().add(2, "week").year() !== dayjs().year()) {
      cy.log("Skipping because recurrent reservation endDate is next year");
      return;
    }
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().add(2, "week").format("DD/MM/YYYY"),
    );
    cy.get("[data-test=reserveButton]").click();
    cy.get("[data-test=calendar-event]").should("be.visible");
    cy.navigateDaysFromToday(7);
    cy.get("[data-test=calendar-event]").should("be.visible");
    // also check that start and end time are correct
    cy.get("[data-test=calendar-event]").should(
      "contain.text",
      "12:00 - 13:00",
    );
  });

  it("GIVEN admin WHEN make recurrent reservation AND there is a conflict THEN error is shown", function () {
    // check if I am not in the last two weeks of the year
    if (dayjs().add(2, "week").year() !== dayjs().year()) {
      cy.log("Skipping because recurrent reservation endDate is next year");
      return;
    }

    //create reservation that will conflict with the recurrent one
    const conflictStartDate = dayjs()
      .add(1, "week")
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0);

    cy.addReservationToDB(
      conflictStartDate.toDate(),
      conflictStartDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("ADMIN_FORO_MAIL") as string,
    );

    // create recurrent reservation
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().add(2, "week").format("DD/MM/YYYY"),
    );
    cy.get("[data-test=reserveButton]").click();

    // check that error is shown
    cy.get("[data-test=error-alert]").should("be.visible");
    cy.get("[data-test=error-alert]").should(
      "contain.text",
      "Errore nella creazione della prenotazione ricorrente. Conflitto in data " +
        conflictStartDate.format("DD/MM/YYYY"),
    );
    cy.get("[data-testid=CloseIcon]").click();

    cy.refetchReservationQuery();
    // check that recurrent reservation has not been created
    cy.get("[calendar-event]").should("not.exist");

    //check that the conflicting reservation is still there
    cy.navigateDaysFromToday(7);
    cy.get("[data-test=calendar-event]").should("have.length", 1);
  });
});

describe("Existing reservation", () => {
  it("GIVEN admin WHEN click on other's reservation THEN can delete", function () {
    const startDate = dayjs().add(2, "day").hour(12).minute(0);

    cy.addReservationToDB(
      startDate.toDate(),
      startDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER2_MAIL") as string, //user_2 because is already added to db in seeding script
    );

    cy.refetchReservationQuery();
    cy.navigateDaysFromToday(2);
    cy.get("[data-test=calendar-event]").click();
    cy.get("[data-test=delete-button]").click();
    cy.get("[data-test=confirm-button]").click();

    cy.get("[data-test=calendar-event]").should("not.exist");
  });

  it("GIVEN admin WHEN select reservation after the time limit THEN can delete", function () {
    cy.addReservationToDB(
      dayjs().add(1, "hour").set("minute", 0).toDate(),
      dayjs().add(2, "hour").set("minute", 0).toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("ADMIN_FORO_MAIL") as string,
    );
  });

  it("GIVEN admin WHEN cancel recurrent reservation series THEN all reservations are deleted", function () {
    // check if I am not in the last week of the year
    if (dayjs().add(1, "week").year() !== dayjs().year()) {
      cy.log("Skipping because recurrent reservation endDate is next year");
      return;
    }
    // create recurrent reservation
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().add(1, "week").format("DD/MM/YYYY"),
    );
    cy.get("[data-test=reserveButton]").click();

    // delete recurrent reservation
    cy.get("[data-test=calendar-event]").click();
    cy.get("[data-test=delete-button]").click();
    cy.get("[data-test=recurrent]").click();
    cy.get("[data-test=confirm-button]").click();

    // check that all reservations have been deleted
    cy.get("[data-test=calendar-event]").should("not.exist");
    cy.navigateDaysFromToday(7);
    cy.get("[data-test=calendar-event]").should("not.exist");
  });

  it("GIVEN admin WHEN cancel single occurrence of recurrent reservation THEN only single reservation deleted", function () {
    // check if I am not in the last week of the year
    if (dayjs().add(2, "week").year() !== dayjs().year()) {
      cy.log("Skipping because recurrent reservation endDate is next year");
      return;
    }
    // create recurrent reservation
    cy.clickOnCalendarSlot(pietrangeliCourtName, 12, 0);
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().add(1, "week").format("DD/MM/YYYY"),
    );
    cy.get("[data-test=reserveButton]").click();

    // delete recurrent reservation (from another occurrence)
    cy.navigateDaysFromToday(7);
    cy.get("[data-test=calendar-event]").click();
    cy.get("[data-test=delete-button]").click();
    cy.get("[data-test=single]").click();
    cy.get("[data-test=confirm-button]").click();

    // check that only that reservation has been deleted
    cy.get("[data-test=calendar-event]").should("not.exist");

    // check that other reservations are still there
    cy.navigateDaysFromToday(0);
    cy.get("[data-test=calendar-event]").should("exist");
  });
});
