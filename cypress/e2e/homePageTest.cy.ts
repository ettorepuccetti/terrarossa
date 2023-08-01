export {};

describe("homepage", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.clearAllSessionStorage();

    cy.visit("http://localhost:3000");
  });

  it("layout", () => {
    cy.get(".MuiPaper-root > .MuiToolbar-root").should("be.visible"); //the toolbar is visible
    cy.get("a > .MuiButtonBase-root").should("be.visible"); //the button "Prenota" is visible
    cy.get("a > .MuiButtonBase-root")
      .parent()
      .should("have.attr", "href", "/search"); //the button "Prenota" has the correct href
  });

  it("GIVEN not logged in user WHEN login from drawer THEN show logout and username in drawer", () => {
    //open drawer
    cy.get("button").filter("[data-test='drawer-button']").click();
    //click on login button
    cy.get(".MuiList-root > :nth-child(1)").should("contain", "Login").click();
    //check if the url is the correct one (auth0)
    cy.url().should("contain", Cypress.env("AUTH0_ISSUER") as string);

    cy.loginToAuth0(
      Cypress.env("AUTH0_USER") as string,
      Cypress.env("AUTH0_PW") as string
    );

    cy.visit("/");
    //open drawer
    cy.get(".css-13pmxen > .MuiButtonBase-root").click();
    //check if the logout button is visible
    cy.get(".MuiList-root").contains("Logout");
    //check the username is displayed
    cy.getUsername().then((username) => {
      cy.get(".MuiList-root > :nth-child(1)").should("contain", username);
    });
  });
});
