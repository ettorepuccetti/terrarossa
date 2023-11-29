import CancelRecurrentDialog from "~/components/CancelRecurrentDialog";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import {
  buildTrpcMutationMock,
  club,
  clubSettings,
  eventDetailsRecurrent,
  mountWithContexts,
  session,
} from "./_constants";

function CancelRecurrentDialogContext() {
  // set club data
  useMergedStoreContext((store) => store.setClubData)({
    clubSettings: clubSettings,
    ...club,
  });

  // set mutations mocks
  const deleteSingle = cy.stub().as("deleteOne");
  const deleteRecurrent = cy.stub().as("deleteRecurrent");
  useMergedStoreContext((store) => store.setReservationDelete)(
    buildTrpcMutationMock(deleteSingle, {
      reservationId: "my_id",
      clubId: club.id,
    }),
  );
  useMergedStoreContext((store) => store.setRecurrentReservationDelete)(
    buildTrpcMutationMock(deleteRecurrent, {
      recurrentReservationId: "my_recurrent_id",
      clubId: club.id,
    }),
  );

  useMergedStoreContext((store) => store.setDeleteConfirmationOpen)(true);
  useMergedStoreContext((store) => store.setEventDetails)(
    eventDetailsRecurrent,
  );

  return <CancelRecurrentDialog />;
}

function mountComponent() {
  mountWithContexts(<CancelRecurrentDialogContext />, session);
}

describe("CancelRecurrentDialog", () => {
  it("GIVEN radio button group WHEN selection single and confirm THEN invoke deleteOne api", () => {
    //given
    mountComponent();

    //when
    cy.get("[data-test=single]").click();
    cy.get("[data-test=confirm-button]").click();

    //then
    cy.get("@deleteOne").should("be.calledOnce");
    cy.get("@deleteRecurrent").should("not.be.called");
    cy.get("[data-test=cancel-recurrent-dialog]").should("not.exist");
  });

  it("GIVEN radio button group WHEN selection recurrent and confirm THEN invoke deleteRecurrent api", () => {
    //given
    mountComponent();

    //when
    cy.get("[data-test=recurrent]").click();
    cy.get("[data-test=confirm-button]").click();

    //then
    cy.get("@deleteRecurrent").should("be.calledOnce");
    cy.get("@deleteOne").should("not.be.called");
    cy.get("[data-test=cancel-recurrent-dialog]").should("not.exist");
  });

  it("GIVEN radio button group WHEN click cancel THEN no invokation called", () => {
    //given
    mountComponent();

    //when
    cy.get("[data-test=cancel-button]").click();

    //then
    cy.get("@deleteRecurrent").should("not.be.called");
    cy.get("@deleteOne").should("not.be.called");
    cy.get("[data-test=cancel-recurrent-dialog]").should("not.exist");
  });
});
