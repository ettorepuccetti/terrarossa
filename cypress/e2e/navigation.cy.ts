import { foroItalicoName } from "~/utils/constants";
import { saveClubInfoAndCleanReservations } from "./_constants";

beforeEach(function () {
  saveClubInfoAndCleanReservations(
    foroItalicoName,
    "clubIdForoItalico",
    "foroItalico",
    "clubSettingsForoItalico",
  );

  cy.then(() => {
    cy.visit(
      `/prenota?clubId=${this.clubIdForoItalico}`,
    ).waitForCalendarPageToLoad();
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

  it("WHEN navigating to home THEN header reverts to default", function () {
    // Visit the club's booking page
    cy.visit(`/prenota?clubId=${this.clubIdForoItalico}`);
    // Navigate back to home page
    cy.getByDataTest("drawer-button").click();
    cy.getByDataTest("home-page-link").click();

    // Verify header reverts to default values
    cy.getByDataTest("header-name").should("contain", "Terrarossa");
    cy.getByDataTest("header-logo")
      .should("have.attr", "src")
      .and("include", "mstile-144x144"); // Assuming default logo src
  });
});
