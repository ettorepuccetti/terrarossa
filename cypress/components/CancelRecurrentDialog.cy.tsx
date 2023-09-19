import CancelRecurrentDialog from "~/components/CancelRecurrentDialog";
import { mountWithContexts, session } from "./constants";

describe("CancelRecurrentDialog", () => {
  it("GIVEN radio button group WHEN selection and confirm THEN invoke the correct function", () => {
    const cancelSingle = cy.stub().as("cancelSingle");
    const cancelRecurrent = cy.stub();
    mountWithContexts(
      <CancelRecurrentDialog
        open={true}
        onDialogClose={() => null}
        onCancelSingle={cancelSingle}
        onCancelRecurrent={cancelRecurrent}
      />,
      session
    );
    cy.get("[data-test=single]").click();
    cy.get("[data-test=confirm-button]")
      .click()
      .then(() => {
        expect(cancelSingle).to.be.calledOnce;
        expect(cancelRecurrent).to.not.be.called;

        cancelSingle.reset();
        cancelRecurrent.reset();
      });

    cy.get("[data-test=recurrent]").click();
    cy.get("[data-test=confirm-button]")
      .click()
      .then(() => {
        expect(cancelSingle).to.not.be.called;
        expect(cancelRecurrent).to.be.calledOnce;

        cancelSingle.reset();
        cancelRecurrent.reset();
      });
  });
});
