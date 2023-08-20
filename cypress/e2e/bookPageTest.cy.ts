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
      .wait(200) //wait for the rerender
      .invoke("val")
      .as("endTime");

    // reserve and close the dialog
    cy.get("[data-test='reserve']").click();

    // check on the reservation card if username, startTime and endTime are correct
    // need to wrap the assertion in a then() because startTime and endTime are set in this scope
    cy.get('[data-test="calendar-event"]').then(function ($element) {
      cy.wrap($element)
        .should("contain", this.username)
        .should("contain", this.startTime)
        .should("contain", this.endTime);
    });
  });

  it("GIVEN club with max reservation time WHEN reserve last time slot THEN reservation is within allowed time window", function () {
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(1) > .fc-timegrid-slot"
    ).click(); // click on first slot

    // check startTime
    cy.get("[data-test='startTime']").should(
      "have.value",
      reservationConstraints.slotMinTime
    );

    // click outside the dialog to close it
    cy.get(".MuiDialog-container").click(5, 5);

    // select the last slot clickable
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-last-child(2) > .fc-timegrid-slot"
    ).click();

    // check startTime
    cy.get("[data-test='endTime']").should(
      "have.value",
      reservationConstraints.slotMaxTime
    );
  });

  it("GIVEN club with max day in the past and future WHEN reserve in first and last visible day THEN reservation shown", function () {
    // create PAST reservation
    const firstVisibleStartDate = dayjs()
      .subtract(reservationConstraints.daysInThePastVisible, "day")
      .hour(parseInt(reservationConstraints.slotMinTime.split(":")[0]))
      .minute(parseInt(reservationConstraints.slotMinTime.split(":")[1]))
      .second(0)
      .millisecond(0);

    cy.createReservation(
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
      .hour(parseInt(reservationConstraints.slotMaxTime.split(":")[0]) - 1) // -1 because slotMaxTime is the closing time of the club
      .minute(parseInt(reservationConstraints.slotMaxTime.split(":")[1]))
      .second(0)
      .millisecond(0);

    cy.createReservation(
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
});
