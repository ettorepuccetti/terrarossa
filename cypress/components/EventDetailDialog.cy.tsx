import { type EventImpl } from "@fullcalendar/core/internal";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import EventDetailDialog from "~/components/EventDetailDialog";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import {
  buildTrpcMutationMock,
  club,
  clubSettings,
  eventDetailsSingle,
  mountWithContexts,
  session,
} from "./_constants";
dayjs.extend(duration);

function EventDetailDialogWrapper(props: { startDate: Date; endDate: Date }) {
  // set clubData
  useMergedStoreContext((store) => store.setClubData)({
    ...club,
    Address: null,
    PhoneNumber: null,
    clubSettings: clubSettings,
  });

  // set mutations mocks: reservationDelete, recurrentReservationDelete
  const deleteOne = cy.stub().as("deleteOne");
  const deleteRecurrent = cy.stub().as("deleteRecurrent");
  useMergedStoreContext((store) => store.setReservationDelete)(
    buildTrpcMutationMock(deleteOne),
  );
  useMergedStoreContext((store) => store.setRecurrentReservationDelete)(
    buildTrpcMutationMock(deleteRecurrent),
  );

  // set eventDetails
  useMergedStoreContext((store) => store.setEventDetails)({
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
  cy.getByDataTest("event-detail-dialog").should("be.visible");
  // court name
  cy.getByDataTest("court-name").should(
    "have.text",
    eventDetailsSingle.getResources()[0]!.title,
  );
  // date
  cy.getByDataTest("date").should("have.text", startDate.format("DD/MM/YYYY"));
  // start time
  cy.getByDataTest("startTime").should("have.text", startDate.format("HH:mm"));
  // end time
  cy.getByDataTest("endTime").should("have.text", endDate.format("HH:mm"));
  //delete button enabled
  cy.get("[data-test=delete-button]").should("be.visible").and("be.enabled");
});
