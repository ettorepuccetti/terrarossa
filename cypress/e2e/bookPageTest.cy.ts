import { type Club } from "@prisma/client";

const dateInTheFuture = (nOfDays: number): Date => {
  const now = new Date();
  const futureDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + nOfDays
  );
  return futureDate;
};

beforeEach("Initial clean up and retrieve clubId from clubName", () => {
  const clubFilter = "foro italico";

  cy.queryFilteredClubs(clubFilter).then(function (clubs: Club[]) {
    if (clubs[0] === undefined) {
      throw new Error("No clubs found");
    }
    cy.wrap(clubs[0].id).as("clubId");
    cy.log(`Deleting all reservation for clubId: ${this.clubId as string}`);
    cy.deleteAllReservationOfClub(this.clubId as string);
  });
});

describe("Not logged user", () => {
  it("GIVEN not logged in user WHEN click on available slot THEN show login button", function () {
    cy.wrap(this.clubId).should("be.a", "string");
    cy.visit(`/prenota?clubId=${this.clubId as string}`);

    // select a random slot
    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(6) > .fc-timegrid-slot"
    ).click();

    // I should see the login button and nothing else
    cy.get("button")
      .filter("[data-test='login']")
      .should("contain", "Effettua il login");

    cy.get("input").should("not.exist");
  });
});

describe("Logged user", () => {
  beforeEach("login with mail/pwd and retrieve username", function () {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USER") as string,
      Cypress.env("AUTH0_PW") as string
    );

    cy.visit(`/prenota?clubId=${this.clubId as string}`);

    cy.getUsername().then((username) => {
      cy.wrap(username).should("be.a", "string").as("username");
    });
  });

  it("GIVEN logged in user WHEN select a free slot THEN he can make a reservation ", function () {
    const twoDaysInFuture = dateInTheFuture(2).getDate().toString();

    // select a date two day in the future
    cy.get("[data-test='day-card']").contains(twoDaysInFuture).click();

    cy.get(
      ".fc-timegrid-slots > table > tbody > :nth-child(6) > .fc-timegrid-slot"
    ).click(); // click on a random slot

    // save endTime
    cy.get("input")
      .filter("[data-test='endTime']")
      .wait(200) //wait for the rerender
      .invoke("val")
      .as("endTime");

    // save startTime
    cy.get("input")
      .filter("[data-test='startTime']")
      .invoke("val")
      .as("startTime");

    // reserve and close the dialog
    cy.get("button").filter("[data-test='reserve']").click();

    // check on the reservation card if username, startTime and endTime are correct
    // need to wrap the assertion in a then() because startTime and endTime are set in this scope
    cy.get('[data-test="calendar-event"]').then(function ($element) {
      cy.wrap($element)
        .should("contain", this.username)
        .should("contain", this.startTime)
        .should("contain", this.endTime);
    });
  });
});
