import { type Club } from "@prisma/client";

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
});
