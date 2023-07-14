export {};

function loginToAuth0 (username: string, password: string) {
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
      // App landing page redirects to Auth0.
      cy.visit("/");

      // Login on Auth0.
      cy.origin(
        Cypress.env("auth0_domain") as string,
        { args },
        ({ username, password }) => {
          cy.get("input#username").type(username);
          cy.get("input#password").type(password);
          cy.contains("button[value=default]", "Continue").click();
        }
      );

      // Ensure Auth0 has redirected us back to the RWA.
      cy.url().should("equal", "http://localhost:3000/");
    },
    {
      validate: () => {
        // Validate presence of access token in localStorage.
        cy.window()
          .its("localStorage")
          .invoke("getItem", "authState")
          .should("exist");
      },
    }
  );

  log.snapshot("after");
  log.end();
}

Cypress.Commands.add("loginToAuth0", loginToAuth0);
