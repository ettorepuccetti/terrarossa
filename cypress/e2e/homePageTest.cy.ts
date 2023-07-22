export {};

describe("homepage", () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.clearAllSessionStorage();
  });

  it("layout", () => {
    cy.visit("http://localhost:3000");
    cy.get('.MuiPaper-root > .MuiToolbar-root').should('be.visible'); //the toolbar is visible
    cy.get('a > .MuiButtonBase-root').should('be.visible'); //the button "Prenota" is visible
    cy.get('a > .MuiButtonBase-root').parent().should('have.attr', 'href', '/search'); //the button "Prenota" has the correct href
  });

  it("login", () => {
    cy.visit("/");

    cy.loginToAuth0(Cypress.env('AUTH0_USER') as string, Cypress.env('AUTH0_PW') as string); //login
    cy.visit("/");

    cy.get('.css-13pmxen > .MuiButtonBase-root').click(); //open drawer
    cy.get('.MuiList-root').contains('Logout'); //check if the logout button is visible
    cy.get('.MuiList-root > :nth-child(1)').should("contain", Cypress.env("username") ); //check the username is displayed
  });
});
