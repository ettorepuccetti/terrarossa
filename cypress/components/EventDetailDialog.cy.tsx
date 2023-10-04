import { CacheProvider, ThemeProvider } from "@emotion/react";
import { type EventImpl } from "@fullcalendar/core/internal";
import { type ResourceApi } from "@fullcalendar/resource";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { SessionProvider } from "next-auth/react";
import EventDetailDialog from "~/components/EventDetailDialog";
import {
  CalendarStoreProvider,
  useCalendarStoreContext,
} from "~/hooks/useCalendarStoreContext";
import lightTheme from "~/styles/lightTheme";
import createEmotionCache from "~/utils/createEmotionCache";
import { session } from "./constants";
import { api } from "~/utils/api";

dayjs.extend(duration);

const EventDetailDialogWrapper = () => {
  const useSetClubId = useCalendarStoreContext((store) => store.setClubId);
  useSetClubId("1");
  return <EventDetailDialog />;
};

const mountComponent = (startDate: Date, endDate: Date) => {
  const eventDetails: EventImpl = {
    extendedProps: {
      userId: session.user.id,
    },
    start: startDate,
    end: endDate,
    getResources() {
      return [
        {
          title: "Campo 1",
        } as ResourceApi,
      ];
    },
  } as unknown as EventImpl;

  cy.mount(
    <CacheProvider value={createEmotionCache()}>
      <ThemeProvider theme={lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SessionProvider session={session}>
            <CalendarStoreProvider>
              <EventDetailDialogWrapper />
            </CalendarStoreProvider>
          </SessionProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

it("check base EventDetailDialog", () => {
  const startDate = dayjs().add(1, "d").set("hour", 10).set("minute", 0);
  const endDate = startDate.add(1, "h");

  mountComponent(startDate.toDate(), endDate.toDate());
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
