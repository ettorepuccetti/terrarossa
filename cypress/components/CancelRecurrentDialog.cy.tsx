import CancelRecurrentDialog from "~/components/CancelRecurrentDialog";
import { mountWithContexts, session } from "./constants";

describe("CancelRecurrentDialog", () => {
  it("Test radio button group selection invoke the current function", () => {
    const cancelSingle = cy.stub().as("cancelSingle");
    const cancelRecurrent = cy.stub();
    const cancelFutures = cy.stub();
    mountWithContexts(
      <CancelRecurrentDialog
        open={true}
        onDialogClose={() => null}
        onCancelSingle={cancelSingle}
        onCancelRecurrent={cancelRecurrent}
        OnCancelFutures={cancelFutures}
      />,
      session
    );
    cy.get("[data-test=single]").click();
    cy.get("[data-test=confirm-button]")
      .click()
      .then(() => {
        expect(cancelSingle).to.be.calledOnce;
        expect(cancelRecurrent).to.not.be.called;
        expect(cancelFutures).to.not.be.called;

        cancelSingle.reset();
        cancelRecurrent.reset();
        cancelFutures.reset();
      });

    cy.get("[data-test=recurrent]").click();
    cy.get("[data-test=confirm-button]")
      .click()
      .then(() => {
        expect(cancelSingle).to.not.be.called;
        expect(cancelRecurrent).to.be.calledOnce;
        expect(cancelFutures).to.not.be.called;

        cancelSingle.reset();
        cancelRecurrent.reset();
        cancelFutures.reset();
      });

    cy.get("[data-test=futures]").click();
    cy.get("[data-test=confirm-button]")
      .click()
      .then(() => {
        expect(cancelSingle).to.not.be.called;
        expect(cancelRecurrent).to.not.be.called;
        expect(cancelFutures).to.be.calledOnce;
      });
  });
});
