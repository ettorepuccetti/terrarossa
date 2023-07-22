import { type Club } from "@prisma/client";

describe("book", () => {
  it("GIVEN not logged in user WHEN click on available slot THEN show login button", () => {
    cy.queryFilteredClubs("foro it").then((clubs: Club[]) => {
      const clubId = clubs[0].id;
      cy.visit(`/prenota?clubId=${clubId}`);
      cy.get(
        ".fc-timegrid-slots > table > tbody > :nth-child(6) > .fc-timegrid-slot"
      ).click(); // click on a random slot
      cy.get("button")
        .filter("[data-test='login']")
        .should("contain", "Effettua il login");
    });
  });

  it("GIVEN not logged in user WHEN click on Login button THEN show full reservation dialog", () => {
    cy.queryFilteredClubs("foro it").then((clubs: Club[]) => {
      const clubId = clubs[0].id;
      cy.visit(`/prenota?clubId=${clubId}`);
      cy.get(
        ".fc-timegrid-slots > table > tbody > :nth-child(6) > .fc-timegrid-slot"
      ).click(); // click on a random slot
      cy.get("button")
        .filter("[data-test='login']")
        .should("contain", "Effettua il login")
        .click();
      
    });
  });
});
