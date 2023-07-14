export {};

describe("homepage", () => {
  it("layout", () => {
    cy.visit("http://localhost:3000");
    cy.get('.MuiPaper-root > .MuiToolbar-root').should('be.visible'); //the toolbar is visible
    cy.get('a > .MuiButtonBase-root').should('be.visible'); //the button "Prenota" is visible
    cy.get('a > .MuiButtonBase-root').parent().should('have.attr', 'href', '/search'); //the button "Prenota" has the correct href
  });

  it("login", () => {
    cy.visit("/");
    cy.get('.css-13pmxen > .MuiButtonBase-root').click(); //open drawer
    cy.get('.MuiList-root').contains('Login').click(); //click on login
    cy.loginToAuth0(Cypress.env('AUTH0_USER') as string, Cypress.env('AUTH0_PW') as string); //login
    cy.visit("/"); //reload page
  });
});
