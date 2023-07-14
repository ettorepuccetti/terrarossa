/// <reference types="cypress" />

import "./command";

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject = any> {
      loginToAuth0(username: string, password: string): void;
    }
  }
}
