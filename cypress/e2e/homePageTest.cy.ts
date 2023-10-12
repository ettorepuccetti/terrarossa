export {};

describe("Homepage", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.clearAllSessionStorage();

    cy.visit("/");
  });

  it("GIVEN not logged in user WHEN login from drawer THEN show logout and username in drawer", () => {
    //open drawer
    cy.get("button").filter("[data-test='drawer-button']").click();
    //click on login button
    cy.get(".MuiList-root > :nth-child(1)").should("contain", "Login").click();
    //check if the url is the correct one (auth0)
    cy.url().should("contain", Cypress.env("AUTH0_ISSUER") as string);

    cy.loginToAuth0(
      Cypress.env("USER1_MAIL") as string,
      Cypress.env("USER1_PWD") as string,
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
