import { type Club } from "@prisma/client";
import dayjs from "dayjs";
import { reservationConstraints } from "~/utils/constants";

beforeEach("Initial clean up and retrieve clubId from clubName", () => {
  cy.queryFilteredClubs("foro italico").then(function (clubs: Club[]) {
    if (clubs[0] === undefined) {
      throw new Error("No clubs found");
    }
    cy.wrap(clubs[0].id)
      .as("clubId")
      .then(() => {
        cy.log(`Deleting all reservation for clubId: ${this.clubId as string}`);
        cy.deleteAllReservationOfClub(this.clubId as string);
      });
  });
});

describe("Not logged user", () => {
  beforeEach("visit calendar page", function () {
    cy.visit(
      `/prenota?clubId=${this.clubId as string}`
    ).waitForCalendarPageToLoad();
  });

  it("GIVEN not logged in user WHEN click on available slot THEN show login button", function () {
    // select a random slot
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(6) > .fc-timegrid-slot"
    ).click();

    // I should see the login button and nothing else
    cy.get("button")
      .filter("[data-test='login']")
      .should("contain", "Effettua il login");

    cy.get("[data-test='startTime']").should("not.exist");
  });

  it("GIVEN user WHEN navigate calendar THEN can go in the past and future according to club settings", function () {
    //check first selectable day is visible
    const firstSelectableDay = dayjs()
      .add(-reservationConstraints.daysInThePastVisible, "day")
      .date()
      .toString()
      .padStart(2, "0");

    cy.get("[data-test='day-card']")
      .first()
      .should("contain", firstSelectableDay);

    //check if the last selectable day is visible
    const lastSelectableDay = dayjs()
      .add(reservationConstraints.daysInTheFutureVisible, "day")
      .date()
      .toString()
      .padStart(2, "0");

    cy.get("[data-test='day-card']")
      .last()
      .should("contain", lastSelectableDay);
  });
});

describe("Logged user", () => {
  beforeEach("login with mail/pwd and retrieve username", function () {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USER") as string,
      Cypress.env("AUTH0_PW") as string
    );

    cy.getUsername().then((username) => {
      cy.wrap(username).should("be.a", "string").as("username");
    });

    cy.visit(
      `/prenota?clubId=${this.clubId as string}`
    ).waitForCalendarPageToLoad();
  });

  it("GIVEN logged in user WHEN select a free slot THEN he can make a reservation ", function () {
    cy.navigateDaysFromToday(2);

    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(6) > .fc-timegrid-slot"
    ).click(); // click on a random slot

    // save startTime
    cy.get("[data-test='startTime']").invoke("val").as("startTime");

    // save endTime
    cy.get("[data-test='endTime']")
      .wait(100) //wait for the rerender
      .invoke("val")
      .as("endTime");

    // reserve and close the dialog
    cy.get("[data-test='reserve-button']").click();

    // check on the reservation card if username, startTime and endTime are correct
    // need to wrap the assertion in a then() because startTime and endTime are set in this scope
    cy.get('[data-test="calendar-event"]').then(function ($element) {
      cy.wrap($element)
        .should("contain", this.username)
        .should("contain", this.startTime)
        .should("contain", this.endTime);
    });
  });

  it("GIVEN club with reservation time constrains WHEN select first and (second)last time slot THEN constrains respected", function () {
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(1) > .fc-timegrid-slot"
    ).click(); // click on first slot

    // check startTime of first bookable slot
    cy.get("[data-test='startTime']").should(
      "have.value",
      reservationConstraints.getClubOpeningTime()
    );

    // click outside the dialog to close it
    cy.get(".MuiDialog-container").click(5, 5);

    // select the last slot clickable
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-last-child(2) > .fc-timegrid-slot"
    ).click();

    // check endTime of last bookable slot
    cy.get("[data-test='endTime']").should(
      "have.value",
      reservationConstraints.getClubClosingTime()
    );
  });

  it("GIVEN club with max day in the past and future WHEN reserve in first and last visible day THEN reservation shown", function () {
    // create PAST reservation
    const firstVisibleStartDate = dayjs()
      .subtract(reservationConstraints.daysInThePastVisible, "day")
      .hour(reservationConstraints.getFirstBookableHour())
      .minute(reservationConstraints.getFirstBookableMinute())
      .second(0)
      .millisecond(0);

    cy.addReservationToDB(
      firstVisibleStartDate.toDate(),
      firstVisibleStartDate.add(1, "hour").toDate(),
      this.clubId as string,
      "Pietrangeli",
      Cypress.env("AUTH0_USER") as string,
      Cypress.env("AUTH0_PW") as string
    );

    // create FUTURE reservation
    const lastVisibleStartDate = dayjs()
      .add(reservationConstraints.daysInTheFutureVisible, "day")
      .hour(reservationConstraints.getLastBookableHour() - 1) // -1 because slotMaxTime is the closing time of the club
      .minute(reservationConstraints.getLastBookableMinute())
      .second(0)
      .millisecond(0);

    cy.addReservationToDB(
      lastVisibleStartDate.toDate(),
      lastVisibleStartDate.add(1, "hour").toDate(),
      this.clubId as string,
      "Pietrangeli",
      Cypress.env("AUTH0_USER") as string,
      Cypress.env("AUTH0_PW") as string
    );

    // CHECKS
    cy.reload().waitForCalendarPageToLoad();

    cy.navigateDaysFromToday(-reservationConstraints.daysInThePastVisible);
    cy.get('[data-test="calendar-event"]').should("be.visible");

    cy.navigateDaysFromToday(reservationConstraints.daysInTheFutureVisible);
    cy.get('[data-test="calendar-event"]').should("be.visible");
  });

  it("GIVEN club with max reservation time WHEN click on very last slot THEN no reservation dialog showed", function () {
    // click on the last slot
    cy.get(
      ".fc-timegrid-slots > table > tbody > :last-child > .fc-timegrid-slot"
    ).click();

    cy.get("[data-test='event-detail-dialog']").should("not.exist");
  });

  it("GIVEN logged user WHEN end time or start time is not 00 or 30 THEN show error and reservation not added", function () {
    cy.navigateDaysFromToday(2);

    cy.clickOnCalendarSlot("Pietrangeli", 11, 0);

    // insert wrong endTime
    cy.get("[data-test='endTime']").type("12:15");

    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "Prenota 1 ora, 1 ora e mezzo o 2 ore"
    );

    // try to reserve by clicking confirm button
    cy.get("[data-test='reserve-button']").should("be.disabled");

    //TODO: force call the API and check the error message
    // cy.get("[data-test='error-alert']")
    //   .should("be.visible")
    //   .and(
    //     "have.text",
    //     "L'orario di inizio e di fine deve essere un multiplo di 30 minuti"
    //   );

    // // close the error dialog
    // cy.get(".MuiAlert-action > .MuiButtonBase-root").click();

    // // check that no reservation has been added
    // cy.get("[data-test='calendar-event']").should("not.exist");
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
      this.clubId as string,
      "Pietrangeli",
      Cypress.env("AUTH0_USER") as string,
      Cypress.env("AUTH0_PW") as string
    );

    cy.reload().waitForCalendarPageToLoad();

    cy.navigateDaysFromToday(1);

    cy.clickOnCalendarSlot("Pietrangeli", 11, 0);

    cy.get("[data-test='endTime']").type("12:30");

    cy.get("[data-test='reserve-button']").click();

    cy.get("[data-test='error-alert']")
      .should("be.visible")
      .and(
        "have.text",
        "La tua prenotazione non puo' essere effettuata. Per favore, scegli un orario in cui il campo è libero"
      );
    // close the error dialog
    cy.get(".MuiAlert-action > .MuiButtonBase-root").click();

    // check that no reservation has been added
    cy.get("[data-test='calendar-event']").should("have.length", 1);
  });

  it("GIVEN logged user WHEN reservation is longer than 2 hours THEN show error and cannot press button", function () {
    cy.navigateDaysFromToday(2);

    cy.clickOnCalendarSlot("Pietrangeli", 11, 0);

    // insert endTime longer than 2 hours
    cy.get("[data-test='endTime']").type("14:00");

    // try to reserve by clicking confirm button
    cy.get("[data-test='reserve-button']").should("be.disabled");

    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "Prenota 1 ora, 1 ora e mezzo o 2 ore"
    );
  });
});
