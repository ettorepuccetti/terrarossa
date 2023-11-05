import { TRPCClientError } from "@trpc/client";
import ErrorAlert from "~/components/ErrorAlert";
import { mountWithContexts } from "./_constants";

describe("<ErrorAlert />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    const errorMessage = "test";
    mountWithContexts(
      <ErrorAlert
        error={new TRPCClientError(errorMessage)}
        onClose={() => null}
      />,
      null,
    );
    cy.get(".MuiAlert-message").should("contain", errorMessage);
  });
});
