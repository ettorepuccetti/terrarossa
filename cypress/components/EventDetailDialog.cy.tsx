import { type EventImpl } from "@fullcalendar/core/internal";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import EventDetailDialog from "~/components/EventDetailDialog";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import {
  buildTrpcMutationMock,
  club,
  clubSettings,
  eventDetailsRecurrent,
  eventDetailsSingle,
  mountWithContexts,
  session,
} from "./_constants";
dayjs.extend(duration);

function EventDetailDialogWrapper(props: { startDate: Date; endDate: Date }) {
  // set clubData
  useCalendarStoreContext((store) => store.setClubData)({
    ...club,
    clubSettings: clubSettings,
  });

  // set mutations mocks: reservationDelete, recurrentReservationDelete
  const deleteOne = cy.stub().as("deleteOne");
  const deleteRecurrent = cy.stub().as("deleteRecurrent");
  useCalendarStoreContext((store) => store.setReservationDelete)(
    buildTrpcMutationMock(deleteOne, {
      reservationId: eventDetailsSingle.id,
      clubId: club.id,
    }),
  );
  useCalendarStoreContext((store) => store.setRecurrentReservationDelete)(
    buildTrpcMutationMock(deleteRecurrent, {
      recurrentReservationId: eventDetailsRecurrent.extendedProps
        .recurrentId as string,
      clubId: club.id,
    }),
  );

  // set eventDetails
  useCalendarStoreContext((store) => store.setEventDetails)({
    ...eventDetailsSingle,
    start: props.startDate,
    end: props.endDate,
  } as EventImpl);
  return <EventDetailDialog />;
}

it("check base EventDetailDialog", () => {
  const startDate = dayjs().add(1, "d").set("hour", 10).set("minute", 0);
  const endDate = startDate.add(1, "h");

  // mount the component with the context
  mountWithContexts(
    <EventDetailDialogWrapper
      startDate={startDate.toDate()}
      endDate={endDate.toDate()}
    />,
    session,
  );

  cy.get("h2").should("contain", "Prenotazione");
  cy.get("[data-test=event-detail-dialog]").should("be.visible");
  // court name
  cy.get("[data-test=court-name").should(
    "have.text",
    eventDetailsSingle.getResources()[0]!.title,
  );
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
