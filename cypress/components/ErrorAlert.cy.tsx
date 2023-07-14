import { TRPCClientError } from "@trpc/client";
import ErrorAlert from "../../src/components/ErrorAlert";

describe("<ErrorAlert />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react

    cy.mount(
      <ErrorAlert error={new TRPCClientError("test")} onClose={() => null} />
    );
    // cy.contains("MuiAlert-message", "test");
    cy.get(".MuiAlert-message").should("contain", "test");
  });
});
