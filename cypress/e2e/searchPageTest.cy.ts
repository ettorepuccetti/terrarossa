import { type Club } from "../../src/generated/prisma/client";
import { foroItalicoName } from "~/utils/constants";
import { saveClubInfoAndCleanReservations } from "./_constants";

describe("search", () => {
  it("GIVEN clubs in db WHEN no search is performed THEN every club is displayed", () => {
    cy.visit("/search");
    cy.get(".MuiPaper-root > .MuiToolbar-root").should("be.visible"); //the toolbar is visible
    cy.get(".MuiInputBase-root").should("be.visible"); //the searchbar is visible
    cy.queryClubs().then((clubs: Club[]) => {
      clubs.forEach((club) => {
        cy.get(".MuiCardContent-root").should("contain", club.name);
      });
    });
  });

  it("GIVEN clubs in db WHEN search an existing club THEN club is displayed", () => {
    const filterString = "foro it";
    cy.visit("/search");
    cy.get("input#search").type(filterString); // note case insensitive
    cy.queryFilteredClubs(filterString).then((clubs: Club[]) => {
      clubs.forEach((club) => {
        cy.get(".MuiCardContent-root").should("contain", club.name);
      });
    });
  });

  it("GIVEN clubs in db WHEN search a non existing club THEN no club is displayed", () => {
    const filterString = "Non existing club";
    cy.visit("/search");
    cy.get("input#search").type(filterString);
    cy.queryFilteredClubs(filterString).then(
      (clubs: Club[]) => assert(clubs.length === 0), //check that effectively no club is present in DB
    );
    cy.get(".MuiCardContent-root").should("not.exist"); // check that no club is displayed in the UI
  });

  it("GIVEN admin user WHEN land on search page THEN redirect to its club page instead", function () {
    saveClubInfoAndCleanReservations(
      foroItalicoName,
      "clubIdForoItalico",
      " ", // don't need to store club name
      " ", // don't need to store clubSettings id
    );

    cy.loginToAuth0(
      Cypress.env("ADMIN_FORO_MAIL") as string,
      Cypress.env("ADMIN_FORO_PWD") as string,
    );

    cy.visit("/search");

    cy.then(() => {
      cy.url().should(
        "include",
        `/prenota?clubId=${this.clubIdForoItalico as string}`,
      );
    });
  });
});
