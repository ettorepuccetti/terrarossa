export {};
function loginToAuth0(username: string, password: string) {
  const log = Cypress.log({
    displayName: "AUTH0 LOGIN",
    message: [`🔐 Authenticating | ${username}`],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot("before");

  const args = { username, password };
  cy.session(
    `auth0-${username}`,
    () => {
      cy.visit("/api/auth/signin/auth0");
      cy.get("button").click();
      // Login on Auth0.
      cy.origin(
        Cypress.env("AUTH0_ISSUER") as string,
        { args },
        ({ username, password }) => {
          cy.get("input#username").type(username);
          cy.get("input#password").type(password);
          cy.get("button[value=default]")
            .filter("[data-action-button-primary='true']")
            .click();
        }
      );

      // Ensure Auth0 has redirected us back to the RWA.
      cy.url().should("equal", "http://localhost:3000/");
    },
    {
      validate: () => {
        // Validate presence of access token in localStorage.
        cy.request("/api/auth/session")
          .its("body")
          .its("user")
          .should("include", { email: username });
      },
    }
  );

  log.snapshot("after");
  log.end();
}

Cypress.Commands.add("loginToAuth0", loginToAuth0);

Cypress.Commands.add("queryClubs", () => {
  return cy.task("prisma:queryClubs");
});

Cypress.Commands.add("queryFilteredClubs", (filter) => {
  return cy.task("prisma:queryFilteredClubs", filter);
});

Cypress.Commands.add("deleteAllReservationOfClub", (clubId: string) => {
  return cy.task("prisma:deleteAllReservationOfClub", clubId);
});

Cypress.Commands.add("getUsername", () => {
  cy.request("http://localhost:3000/api/auth/session").then(
    (response: { body: { user: { name: string } } }) => {
      expect(response.body).to.not.be.undefined;
      expect(response.body.user).to.not.be.undefined;
      expect(response.body.user.name).to.not.be.undefined;

      return response.body.user.name;
    }
  );
});

Cypress.Commands.add("dbSeed", () => {
  cy.exec('npx prisma db seed').its('code').should('eq', 0)
});