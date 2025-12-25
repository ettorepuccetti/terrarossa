import { foroItalicoName } from "~/utils/constants";
import { saveClubInfoAndCleanReservations } from "./_constants";

beforeEach(function () {
  saveClubInfoAndCleanReservations(
    foroItalicoName,
    "clubIdForoItalico",
    "foroItalico",
    "clubSettingsForoItalico",
  );
});

describe("login user", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.clearAllSessionStorage();
  });

  it("GIVEN not logged in user WHEN login from drawer THEN show logout and username in drawer", () => {
    cy.visit("/search");
    //open drawer
    cy.getByDataTest("drawer-button").click();
    //click on login button
    cy.get(".MuiList-root > :nth-child(1)").should("contain", "Login").click();
    //check if the url is the correct one (auth0)
    cy.url().should("contain", Cypress.env("AUTH0_ISSUER") as string);

    cy.loginToAuth0(
      Cypress.env("USER1_MAIL") as string,
      Cypress.env("USER1_PWD") as string,
    );

    cy.visit("/search");
    //open drawer
    cy.getByDataTest("drawer-button").click();
    //check if the logout button is visible
    cy.get(".MuiList-root").contains("Logout");
    //check the username is displayed
    cy.getUsername().then((username) => {
      cy.get(".MuiList-root > :nth-child(1)").should("contain", username);
    });
  });
});

describe("navigation", () => {
  it("GIVEN WHEN visiting a club booking page THEN header shows club title and logo", function () {
    // Visit the club's booking page
    cy.visit(`/prenota?clubId=${this.clubIdForoItalico}`);

    // Verify header shows club-specific title and logo
    cy.getByDataTest("header-name").should("contain", foroItalicoName);
    cy.getByDataTest("header-logo")
      .should("have.attr", "src")
      .and("include", "bnl-logo"); // Assuming club logo src contains identifier
  });

  it("GIVEN user on booking page WHEN navigating to other page THEN header reverts to default", function () {
    // Visit the club's booking page
    cy.visit(
      `/prenota?clubId=${this.clubIdForoItalico}`,
    ).waitForCalendarPageToLoad();
    // Navigate to other page
    cy.visit("/search");

    // Verify header reverts to default values
    cy.getByDataTest("header-name").should("contain", "Terrarossa");
    cy.getByDataTest("header-logo")
      .should("have.attr", "src")
      .and("include", "mstile-144x144"); // Assuming default logo src
  });
});
