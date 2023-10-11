import { type EventImpl } from "@fullcalendar/core/internal";
import { type ResourceApi } from "@fullcalendar/resource";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import EventDetailDialog from "~/components/EventDetailDialog";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { mountWithContexts, session } from "./_constants";
dayjs.extend(duration);

function EventDetailDialogWrapper(props: { startDate: Date; endDate: Date }) {
  const eventDetails: EventImpl = {
    extendedProps: {
      userId: session.user.id,
    },
    start: props.startDate,
    end: props.endDate,
    getResources() {
      return [
        {
          title: "Campo 1",
        } as ResourceApi,
      ];
    },
  } as unknown as EventImpl;

  useCalendarStoreContext((store) => store.setClubId)("1");
  useCalendarStoreContext((store) => store.setEventDetails)(eventDetails);
  return <EventDetailDialog />;
}

it("check base EventDetailDialog", () => {
  const startDate = dayjs().add(1, "d").set("hour", 10).set("minute", 0);
  const endDate = startDate.add(1, "h");

  // mock the api call for getting the club info
  cy.intercept("GET", "/api/trpc/**club.getByClubId**", {
    fixture: "club.getByClubId.json",
  }).as("getClub");

  // mount the component with the context
  mountWithContexts(
    <EventDetailDialogWrapper
      startDate={startDate.toDate()}
      endDate={endDate.toDate()}
    />,
    session
  );

  cy.get("h2").should("contain", "Prenotazione");
  cy.get("[data-test=event-detail-dialog]").should("be.visible");
  // court name
  cy.get("[data-test=court-name").should("have.text", "Campo 1");
  // date
  cy.get("[data-test=date]")
    .find("input")
    .should("have.value", startDate.format("DD/MM/YYYY"));
  // start time
  cy.get("[data-test=startTime]")
    .find("input")
    .should("have.value", startDate.format("HH:mm"));
  // end time
  cy.get("[data-test=endTime]")
    .find("input")
    .should("have.value", endDate.format("HH:mm"));
  //delete button enabled
  cy.get("[data-test=delete-button]").should("be.visible").and("be.enabled");
});
