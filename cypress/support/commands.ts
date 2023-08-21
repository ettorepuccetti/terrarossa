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

Cypress.Commands.add("navigateDaysFromToday", (n: number) => {
  const nextDaysAsString = (nOfDays: number): string => {
    const now = new Date();
    const futureDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + nOfDays
    );
    return futureDate.getDate().toString().padStart(2, "0");
  };

  cy.log("Selecting day of the month: " + nextDaysAsString(n));

  // select a date two day in the future
  cy.get("[data-test='day-card']").contains(nextDaysAsString(n)).click();
});

Cypress.Commands.add(
  "createReservation",
  (
    startDate: Date,
    endDate: Date,
    clubId: string,
    courtName: string,
    userName: string
  ) => {
    cy.task("prisma:makeReservation", {
      startTime: startDate,
      endTime: endDate,
      clubId: clubId,
      courtName: courtName,
      userMail: userName,
    });
  }
);

Cypress.Commands.add("waitForCalendarPageToLoad", () => {
  cy.get(".MuiContainer-root").should("be.visible");
  cy.wait(100);
  cy.get("[data-test='spinner']").should("not.be.visible");
});

Cypress.Commands.add(
  "clickOnCalendarSlot",
  (courtName: string, hour: string) => {
    cy.scrollTo("top");

    cy.get(".fc-timegrid-slot-label-cushion")
      .contains(hour)
      .then(($row) => {
        cy.log("getting Y:", $row[0].getBoundingClientRect().y.toString());
        cy.wrap(
          $row[0].getBoundingClientRect().top +
            $row[0].getBoundingClientRect().height / 2
        ).as("slotY");
      });
    cy.get(".fc-scrollgrid-sync-inner")
      .contains(courtName)
      .then(($row) => {
        cy.log("getting X:", $row[0].getBoundingClientRect().x.toString());
        cy.wrap(
          $row[0].getBoundingClientRect().left +
            $row[0].getBoundingClientRect().width / 2
        ).as("slotX");
      });

    cy.scrollTo("top");
    cy.get("body").then(function ($el) {
      cy.wrap($el).click(this.slotX as number, this.slotY as number);
    });

    cy.get("[data-test='reserve-dialog']").should("be.visible");
    cy.get("[data-test='startTime']").should("have.value", hour);
  }
);
