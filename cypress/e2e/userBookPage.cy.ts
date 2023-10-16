import { type Club, type ClubSettings } from "@prisma/client";
import dayjs from "dayjs";
import {
  allEnglandClubName,
  centerCourtName,
  centralCourtName,
  court1AllEngName,
  court1ForoName,
  foroItalicoName,
  pietrangeliCourtName,
} from "~/utils/constants";
import { formatTimeString } from "~/utils/utils";
import {
  loginAndVisitCalendarPage,
  saveClubInfoAndCleanReservations,
} from "./_constants";

beforeEach("Initial clean up and retrieve Clubs", function () {
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

  // .then() so I can use previous aliases
  cy.then(() => {
    loginAndVisitCalendarPage(
      Cypress.env("USER1_MAIL") as string,
      Cypress.env("USER1_PWD") as string,
      this.clubIdForoItalico as string,
    );
  });
});

describe("Calendar navigation", () => {
  it("GIVEN club with max day in the past and future WHEN navigate calendar THEN cannot go beyond those limits", function () {
    //check first selectable day is visible
    const firstSelectableDay = dayjs()
      .subtract(
        (this.clubSettingsForoItalico as ClubSettings).daysInThePastVisible,
        "day",
      )
      .date()
      .toString()
      .padStart(2, "0");

    cy.get("[data-test='day-card']")
      .first()
      .should("contain", firstSelectableDay);

    //check if the last selectable day is visible
    const lastSelectableDay = dayjs()
      .add(
        (this.clubSettingsForoItalico as ClubSettings).daysInFutureVisible,
        "day",
      )
      .date()
      .toString()
      .padStart(2, "0");

    cy.get("[data-test='day-card']")
      .last()
      .should("contain", lastSelectableDay);
  });

  it("GIVEN club with max day in the past and future WHEN reserve on first and last visible day THEN reservation shown", function () {
    // create PAST reservation
    const firstVisibleStartDate = dayjs()
      .subtract(
        (this.clubSettingsForoItalico as ClubSettings).daysInThePastVisible,
        "day",
      )
      .hour((this.clubSettingsForoItalico as ClubSettings).firstBookableHour)
      .minute(
        (this.clubSettingsForoItalico as ClubSettings).firstBookableMinute,
      )
      .second(0)
      .millisecond(0);

    cy.addReservationToDB(
      firstVisibleStartDate.toDate(),
      firstVisibleStartDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER1_MAIL") as string,
    );

    // create FUTURE reservation
    const lastVisibleStartDate = dayjs()
      .add(
        (this.clubSettingsForoItalico as ClubSettings).daysInFutureVisible,
        "day",
      )
      .hour((this.clubSettingsForoItalico as ClubSettings).lastBookableHour)
      .minute((this.clubSettingsForoItalico as ClubSettings).lastBookableMinute)
      .second(0)
      .millisecond(0);

    cy.addReservationToDB(
      lastVisibleStartDate.toDate(),
      lastVisibleStartDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER1_MAIL") as string,
    );

    // CHECKS
    cy.refetchReservationQuery();

    cy.navigateDaysFromToday(
      -(this.clubSettingsForoItalico as ClubSettings).daysInThePastVisible,
    );
    cy.get('[data-test="calendar-event"]').should("be.visible");

    cy.navigateDaysFromToday(
      (this.clubSettingsForoItalico as ClubSettings).daysInFutureVisible,
    );
    cy.get('[data-test="calendar-event"]').should("be.visible");
  });

  it("GIVEN club with reservation first and last hour WHEN select first and second last slot THEN constrains respected", function () {
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(1) > .fc-timegrid-slot",
    ).click(); // click on first slot

    // check startTime of first bookable slot
    cy.get("[data-test='startTime']").should(
      "have.value",
      formatTimeString(
        (this.clubSettingsForoItalico as ClubSettings).firstBookableHour,
        (this.clubSettingsForoItalico as ClubSettings).firstBookableMinute,
      ),
    );

    // click outside the dialog to close it
    cy.get(".MuiDialog-container").click(5, 5);

    // select the last slot bookable
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-last-child(2) > .fc-timegrid-slot",
    ).click();

    // check endTime of last bookable slot
    cy.get("[data-test='endTime']")
      .should(
        "have.value",
        formatTimeString(
          (this.clubSettingsForoItalico as ClubSettings).lastBookableHour + 1, //TODO: implicit assumption
          (this.clubSettingsForoItalico as ClubSettings).lastBookableMinute,
        ),
      )
      .and("have.attr", "aria-invalid", "false");
  });

  it("GIVEN club with reservation last hour WHEN click on very last slot THEN no reservation dialog showed", function () {
    // click on the last slot
    cy.get(
      ".fc-timegrid-slots > table > tbody > :last-child > .fc-timegrid-slot",
    ).click();

    cy.get("[data-test='event-detail-dialog']").should("not.exist");
  });

  it("GIVEN two club with a court with same name WHEN get all reservation of one club THEN show only reservation of one club", function () {
    const startDate = dayjs()
      .add(1, "day")
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0);

    cy.addReservationToDB(
      startDate.toDate(),
      startDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      court1ForoName,
      Cypress.env("USER1_MAIL") as string,
    );

    cy.addReservationToDB(
      startDate.toDate(),
      startDate.add(1, "hour").toDate(),
      this.clubIdAllEngland as string,
      court1AllEngName,
      Cypress.env("USER1_MAIL") as string,
    );

    cy.refetchReservationQuery();
    cy.navigateDaysFromToday(1);

    cy.get("[data-test='calendar-event']").should("have.length", 1);
  });
});

describe("New Reservation", () => {
  it("GIVEN not logged in user WHEN click on available slot THEN show login button", function () {
    cy.logout();

    cy.visit(
      `/prenota?clubId=${this.clubIdForoItalico as string}`,
    ).waitForCalendarPageToLoad();

    // select a random slot
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(6) > .fc-timegrid-slot",
    ).click();

    // I should see the login button and nothing else
    cy.get("button")
      .filter("[data-test='login']")
      .should("contain", "Effettua il login");

    cy.get("[data-test='startTime']").should("not.exist");
  });

  it("GIVEN logged user WHEN end time or start time is not 00 or 30 THEN show error and reservation not added", function () {
    cy.navigateDaysFromToday(2);

    cy.clickOnCalendarSlot(pietrangeliCourtName, 11, 0);

    // insert wrong endTime
    cy.get("[data-test='endTime']").type("12:15");

    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "Prenota 1 ora, 1 ora e mezzo o 2 ore",
    );

    // try to reserve by clicking confirm button
    cy.get("[data-test=reserveButton]").should("be.disabled");
  });

  it("GIVEN logged user WHEN reserve with a clash THEN show error banner and reservation not added", function () {
    // create a reservation in the next day, for avoiding `reservation in the past` warning
    const startDate = dayjs()
      .add(1, "day")
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0);

    cy.addReservationToDB(
      startDate.toDate(),
      startDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER1_MAIL") as string,
    );

    cy.refetchReservationQuery();

    cy.navigateDaysFromToday(1);

    cy.clickOnCalendarSlot(pietrangeliCourtName, 11, 0);

    cy.get("[data-test='endTime']").type("12:30");

    cy.get("[data-test=reserveButton]").click();

    cy.get("[data-test='error-alert']")
      .should("be.visible")
      .and(
        "have.text",
        "La tua prenotazione non puo' essere effettuata. Per favore, scegli un orario in cui il campo è libero",
      );
    // close the error dialog
    cy.get(".MuiAlert-action > .MuiButtonBase-root").click();

    // check that no reservation has been added
    cy.get("[data-test='calendar-event']").should("have.length", 1);
  });

  it("GIVEN logged user WHEN reservation is longer than 2 hours THEN show error and cannot press button", function () {
    cy.navigateDaysFromToday(2);

    cy.clickOnCalendarSlot(pietrangeliCourtName, 11, 0);

    // insert endTime longer than 2 hours
    cy.get("[data-test='endTime']").type("14:00");

    // check reserve button is disabled
    cy.get("[data-test=reserveButton]").should("be.disabled");

    // check error message
    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "Prenota al massimo 2 ore. Rispetta l'orario di chiusura del circolo",
    );
  });

  it("GIVEN logged user WHEN exceed max active reservations THEN show warning and cannot reserve", function () {
    const startDate = dayjs()
      .add(2, "days")
      .hour((this.clubSettingsForoItalico as ClubSettings).firstBookableHour)
      .minute(
        (this.clubSettingsForoItalico as ClubSettings).firstBookableMinute,
      )
      .second(0)
      .millisecond(0);
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
        Cypress.env("USER1_MAIL") as string,
      );
    }
    // check that all reservation have been added
    cy.refetchReservationQuery();
    cy.navigateDaysFromToday(2);
    cy.get("[data-test='calendar-event']").should(
      "have.length",
      (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser,
    );

    // try to add another reservation, fairly far from the others.
    cy.clickOnCalendarSlot(pietrangeliCourtName, 20, 0);
    cy.get("[data-test=reserveButton]").click();

    //Error expected
    cy.get("[data-test='error-alert']").should(
      "have.text",
      `Hai raggiunto il numero massimo di prenotazioni attive (${
        (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser
      })`,
    );
    // Number of reservations should not change
    cy.get(".MuiAlert-action > .MuiButtonBase-root").click();
    cy.get("[data-test='calendar-event']").should(
      "have.length",
      (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser,
    );

    // delete one reservation and try again
    cy.get("[data-test='calendar-event']").first().click();
    cy.get("[data-test='delete-button']").click();
    cy.get("[data-test='confirm-button']").click();
    cy.get("[data-test='calendar-event']").should(
      "have.length",
      (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser - 1,
    );

    //add reservation in different club and check that does not affect the count
    cy.addReservationToDB(
      dayjs()
        .add(1, "day")
        .set("h", 20)
        .set("m", 0)
        .set("s", 0)
        .set("ms", 0)
        .toDate(),
      dayjs()
        .add(1, "day")
        .set("h", 21)
        .set("m", 0)
        .set("s", 0)
        .set("ms", 0)
        .toDate(),
      this.clubIdAllEngland as string,
      centerCourtName,
      Cypress.env("USER1_MAIL") as string,
    );

    // try again, succeed this time
    cy.clickOnCalendarSlot(pietrangeliCourtName, 20, 0);
    cy.get("[data-test=reserveButton]").click();
    cy.get("[data-test='error-alert']").should("not.exist");
    cy.get("[data-test='calendar-event']").should(
      "have.length",
      (this.clubSettingsForoItalico as ClubSettings).maxReservationPerUser,
    );
  });
});

describe("Reservation details", () => {
  it("GIVEN logged user WHEN click on other's reservation THEN not show detail dialog", function () {
    const dayInAdvance = 2;
    const startDate = dayjs()
      .add(dayInAdvance, "days")
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0);
    cy.addReservationToDB(
      startDate.toDate(),
      startDate.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER2_MAIL") as string,
    );
    cy.refetchReservationQuery();
    cy.navigateDaysFromToday(dayInAdvance);
    // check that the reservation is visible
    cy.get("[data-test='calendar-event']").should("have.length", 1);
    // click on the reservation
    cy.get("[data-test='calendar-event']").click();
    // check that the dialog is visible
    cy.get("[data-test='event-detail-dialog']").should("not.exist");
  });

  it("GIVEN logged user WHEN select own reservation after the time limit THEN show warning and cannot delete", function () {
    let firstStartDateNotDeletable = dayjs()
      .add(
        (this.clubSettingsForoItalico as ClubSettings).hoursBeforeCancel,
        "hour",
      )
      .millisecond(0)
      .second(0)
      .minute(0);

    const clubClosingTimeToday = dayjs()
      .hour((this.clubSettingsForoItalico as ClubSettings).lastBookableHour)
      .minute((this.clubSettingsForoItalico as ClubSettings).lastBookableMinute)
      .second(0)
      .millisecond(0);
    const clubOpeningTimeTomorrow = dayjs()
      .add(1, "day")
      .hour((this.clubSettingsForoItalico as ClubSettings).firstBookableHour)
      .minute(
        (this.clubSettingsForoItalico as ClubSettings).firstBookableMinute,
      )
      .second(0)
      .millisecond(0);
    const clubOpeningTimeToday = dayjs()
      .hour((this.clubSettingsForoItalico as ClubSettings).firstBookableHour)
      .minute(
        (this.clubSettingsForoItalico as ClubSettings).firstBookableMinute,
      )
      .second(0)
      .millisecond(0);

    //if the reservation to create is before the opening time of the club (because we are after midnight)
    //start it from the last bookable time of yesterday
    if (firstStartDateNotDeletable.isBefore(clubOpeningTimeToday)) {
      firstStartDateNotDeletable = dayjs()
        .subtract(1, "day")
        .hour((this.clubSettingsForoItalico as ClubSettings).lastBookableHour)
        .minute(
          (this.clubSettingsForoItalico as ClubSettings).lastBookableMinute,
        )
        .second(0)
        .millisecond(0);
    }

    // if the reservation to create falls in the closing time window
    // start it from the last bookable time of today
    if (
      firstStartDateNotDeletable.isAfter(clubClosingTimeToday) &&
      firstStartDateNotDeletable.isBefore(clubOpeningTimeTomorrow)
    ) {
      firstStartDateNotDeletable = dayjs()
        .hour((this.clubSettingsForoItalico as ClubSettings).lastBookableHour)
        .minute(
          (this.clubSettingsForoItalico as ClubSettings).lastBookableMinute,
        )
        .second(0)
        .millisecond(0);
    }

    cy.addReservationToDB(
      firstStartDateNotDeletable.toDate(),
      firstStartDateNotDeletable.add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER1_MAIL") as string,
    );
    cy.refetchReservationQuery();
    cy.navigateDaysFromToday(firstStartDateNotDeletable.day() - dayjs().day());

    cy.get("[data-test=calendar-event]").click();
    cy.get("[data-test=delete-button]").should("be.disabled");
    cy.get("[data-test=alert").should(
      "have.text",
      `Non puoi cancellare una prenotazione meno di ${
        (this.clubSettingsForoItalico as ClubSettings).hoursBeforeCancel
      } ore prima del suo inizio`,
    );
  });

  describe("Clubs navigation", () => {
    it("GIVEN user WHEN change club THEN show updated club info", function () {
      const foroItalicoSettings = this.clubSettingsForoItalico as ClubSettings;
      const foroItalico = this.foroItalico as Club;

      //check header name
      cy.get("[data-test='header-name']").should("contain", foroItalico.name);

      // check last date
      cy.get("[data-test='day-card']")
        .last()
        .should(
          "contain",
          dayjs().add(foroItalicoSettings.daysInFutureVisible, "day").date(),
        );

      // check first date
      cy.get("[data-test='day-card']")
        .first()
        .should(
          "contain",
          dayjs()
            .subtract(foroItalicoSettings.daysInThePastVisible, "day")
            .date(),
        );

      // change club
      const allEnglandSettings = this.clubSettingsAllEngland as ClubSettings;
      const allEngland = this.allEngland as Club;

      cy.get('[data-test="drawer-button"]').click();
      cy.get('[data-test="reserve-page-link"]').click();
      cy.getByDataTest("club-card-" + allEngland.name)
        .should("be.visible")
        .click();

      // check header name
      cy.get("[data-test='header-name']").should("contain", allEngland.name);

      // check last date
      cy.get("[data-test='day-card']")
        .last()
        .should(
          "contain",
          dayjs().add(allEnglandSettings.daysInFutureVisible, "day").date(),
        );

      // check first date
      cy.get("[data-test='day-card']")
        .first()
        .should(
          "contain",
          dayjs()
            .subtract(allEnglandSettings.daysInThePastVisible, "day")
            .date(),
        );
    });
  });
});
