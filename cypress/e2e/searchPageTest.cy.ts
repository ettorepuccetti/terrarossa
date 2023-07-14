export {};

describe("search", () => {
  it("passes", () => {
    cy.visit("/search");
    cy.get(".MuiPaper-root > .MuiToolbar-root").should("be.visible"); //the toolbar is visible
    cy.get(".MuiInputBase-root").should("be.visible"); //the searchbar is visible
  });
});
