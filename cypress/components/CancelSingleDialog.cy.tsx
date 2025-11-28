import CancelSingleDialog from "~/components/CancelSingleDialog";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import {
  buildTrpcMutationMock,
  club,
  clubSettings,
  eventDetailsSingle,
  mountWithContexts,
  session,
} from "./_constants";

function CancelSingleDialogContext() {
  // set club data
  useMergedStoreContext((store) => store.setClubData)({
    clubSettings: clubSettings,
    Address: null,
    phoneNumber: null,
    ...club,
  });

  // set mutations mocks
  const deleteOne = cy.stub().as("deleteOne");
  useMergedStoreContext((store) => store.setReservationDelete)(
    buildTrpcMutationMock(deleteOne),
  );

  useMergedStoreContext((store) => store.setDeleteConfirmationOpen)(true);
  useMergedStoreContext((store) => store.setEventDetails)(eventDetailsSingle);
  return <CancelSingleDialog />;
}

function mountComponent() {
  mountWithContexts(<CancelSingleDialogContext />, session);
}

describe("CancelSingleDialog", () => {
  it("GIVEN confirmation dialog WHEN click on confirm THEN invoke deleteOne api", () => {
    //given
    mountComponent();

    //when
    cy.get("[data-test=confirm-button]").click();

    //then
    cy.get("@deleteOne").should("be.calledOnce");
    cy.get("[data-test=cancel-single-dialog]").should("not.exist");
  });

  it("GIVEN confirmation dialog WHEN click on cancel THEN not invoke deleteOne api", () => {
    //given
    mountComponent();

    //when
    cy.get("[data-test=cancel-button]").click();

    //then
    cy.get("@deleteOne").should("not.be.called");
    cy.get("[data-test=cancel-single-dialog]").should("not.exist");
  });
});
