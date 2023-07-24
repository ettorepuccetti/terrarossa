import { TRPCClientError } from "@trpc/client";
import ErrorAlert from "../../src/components/ErrorAlert";

describe("<ErrorAlert />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    const errorMessage = "test";
    cy.mount(
      <ErrorAlert error={new TRPCClientError(errorMessage)} onClose={() => null} />
    );
    cy.get(".MuiAlert-message").should("contain", errorMessage);
  });
});
