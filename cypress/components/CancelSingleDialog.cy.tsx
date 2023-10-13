import { type EventImpl } from "@fullcalendar/core/internal";
import { type ResourceApi } from "@fullcalendar/resource";
import dayjs from "dayjs";
import CancelSingleDialog from "~/components/CancelSingleDialog";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { mountWithContexts, session } from "./_constants";

function CancelSingleDialogContext() {
  useCalendarStoreContext((store) => store.setClubId)("1");
  useCalendarStoreContext((store) => store.setDeleteConfirmationOpen)(true);
  useCalendarStoreContext((store) => store.setEventDetails)({
    id: "my_id",
    extendedProps: {
      userId: session.user.id,
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

  const deleteOne = cy.stub().as("deleteOne");
  return <CancelSingleDialog useReservationDelete={deleteOne} />;
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
