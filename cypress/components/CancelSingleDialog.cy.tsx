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

  return <CancelSingleDialog />;
}

function mountComponent() {
  cy.intercept("POST", "/api/trpc/reservationMutation.deleteOne?*", {
    fixture: "empty-response.json",
  }).as("deleteSingleApi");

  //just to avoid error in console
  cy.intercept(
    "GET",
    "/api/trpc/reservationQuery.getAllVisibleInCalendarByClubId?**",
    { fixture: "empty-response.json" }
  ).as("getReservationsApi");

  mountWithContexts(<CancelSingleDialogContext />, session);
}

describe("CancelSingleDialog", () => {
  it("GIVEN confirmation dialog WHEN click on confirm THEN invoke deleteOne api", () => {
    const deleteOne = cy.spy().as("deleteOne");

    mountComponent();
    cy.get("[data-test=confirm-button]").click();

    cy.wait("@deleteSingleApi").then((_interception) => {
      deleteOne();
    });

    cy.get("@deleteOne").should("be.calledOnce");
    cy.get("[data-test=cancel-single-dialog]").should("not.exist");
  });

  it("GIVEN confirmation dialog WHEN click on cancel THEN not invoke deleteOne api", () => {
    mountComponent();
    const deleteOne = cy.spy().as("deleteOne");
    cy.wait("@getReservationsApi").then((_interception) => {
      deleteOne();
    });
    cy.get("[data-test=cancel-button]").click();
    cy.get("[data-test=cancel-single-dialog]").should("not.exist");
  });
});
