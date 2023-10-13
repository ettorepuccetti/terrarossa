import { type EventImpl } from "@fullcalendar/core/internal";
import { type ResourceApi } from "@fullcalendar/resource";
import dayjs from "dayjs";
import CancelRecurrentDialog from "~/components/CancelRecurrentDialog";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { mountWithContexts, session } from "./_constants";

function CancelRecurrentDialogContext() {
  useCalendarStoreContext((store) => store.setClubId)("1");
  useCalendarStoreContext((store) => store.setDeleteConfirmationOpen)(true);
  useCalendarStoreContext((store) => store.setEventDetails)({
    id: "my_id",
    extendedProps: {
      userId: session.user.id,
      recurrentId: "my_recurrent_id",
    },
    start: dayjs(),
    end: dayjs(),
    getResources() {
      return [
        {
          title: "Campo 1",
        } as ResourceApi,
      ];
    },
  } as unknown as EventImpl);

  const deleteSingle = cy.stub().as("deleteOne");
  const deleteRecurrent = cy.stub().as("deleteRecurrent");
  return (
    <CancelRecurrentDialog
      useReservationDelete={deleteSingle}
      useRecurrentReservationDelete={deleteRecurrent}
    />
  );
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
