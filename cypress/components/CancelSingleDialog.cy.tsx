import CancelSingleDialog from "~/components/CancelSingleDialog";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
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
  useCalendarStoreContext((store) => store.setClubData)({
    clubSettings: clubSettings,
    ...club,
  });

  // set mutations mocks
  const deleteOne = cy.stub().as("deleteOne");
  useCalendarStoreContext((store) => store.setReservationDelete)(
    buildTrpcMutationMock(deleteOne, {
      reservationId: "my_id",
      clubId: "my_club_id",
    }),
  );

  useCalendarStoreContext((store) => store.setDeleteConfirmationOpen)(true);
  useCalendarStoreContext((store) => store.setEventDetails)(eventDetailsSingle);
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
