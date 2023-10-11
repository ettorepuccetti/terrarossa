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

  return <CancelRecurrentDialog />;
}

function mountComponent() {
  cy.intercept("POST", "/api/trpc/reservationMutation.deleteOne?*", {
    fixture: "empty-response.json",
  }).as("deleteOneApi");

  cy.intercept("POST", "/api/trpc/reservationMutation.deleteRecurrent?*", {
    fixture: "empty-response.json",
  }).as("deleteRecurrentApi");

  //just to avoid error in console
  cy.intercept(
    "GET",
    "/api/trpc/reservationQuery.getAllVisibleInCalendarByClubId?**",
    { fixture: "empty-response.json" }
  ).as("getReservationsApi");

  mountWithContexts(<CancelRecurrentDialogContext />, session);
}

describe("CancelRecurrentDialog", () => {
  it("GIVEN radio button group WHEN selection single and confirm THEN invoke deleteOne api", () => {
    mountComponent();
    const deleteOne = cy.spy().as("deleteOne");
    cy.wait("@getReservationsApi").then((_interception) => {
      deleteOne();
    });
    cy.get("[data-test=single]").click();
    cy.get("[data-test=confirm-button]").click();

    cy.get("@deleteOne").should("be.calledOnce");
  });

  it("GIVEN radio button group WHEN selection recurrent and confirm THEN invoke deleteRecurrent api", () => {
    mountComponent();
    const deleteRecurrent = cy.spy().as("deleteRecurrent");
    cy.wait("@getReservationsApi").then((_interception) => {
      deleteRecurrent();
    });
    cy.get("[data-test=recurrent]").click();
    cy.get("[data-test=confirm-button]").click();

    cy.get("@deleteRecurrent").should("be.calledOnce");
  });
});
