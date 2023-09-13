import { CacheProvider, ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { type ClubSettings } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import ReserveDialog from "~/components/ReserveDialog";
import lightTheme from "~/styles/lightTheme";
import createEmotionCache from "~/utils/createEmotionCache";
import { clubSettings, session } from "./constants";
dayjs.extend(duration);

const mountComponent = (
  startDate: Dayjs | undefined,
  session: Session | null | undefined,
  clubSettingsInput: ClubSettings = clubSettings
) => {
  cy.mount(
    <CacheProvider value={createEmotionCache()}>
      <ThemeProvider theme={lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SessionProvider session={session}>
            <ReserveDialog
              open={true}
              clubId="clubId"
              startDate={startDate?.toDate()}
              resource={"Campo 1"}
              onConfirm={(endDate) => console.log("end date :", endDate)}
              onDialogClose={() => null}
              clubSettings={clubSettingsInput}
            />
          </SessionProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

describe("<Reservation Dialog />", () => {
  it("GIVEN I am not logged in WHEN dialog THEN show login button", () => {
    mountComponent(undefined, undefined);
    cy.get("h2").should("contain", "Prenota");
    cy.get(".MuiButtonBase-root").should("contain", "Effettua il login");
  });

  it("GIVEN logged user WHEN reserve one hour in the future THEN can press reserve button", () => {
    // fixed time of a future date. TIME: 13:00
    const startDate = dayjs()
      .add(1, "day")
      .hour(13)
      .minute(0)
      .second(0)
      .millisecond(0);

    mountComponent(startDate, session);

    cy.get("h2").should("contain", "Prenota");

    // check date
    cy.get("input")
      .filter("[data-test='date']")
      .should("have.value", startDate.format("DD/MM/YYYY"));

    // check start time
    cy.get("input")
      .filter("[data-test='startTime']")
      .should("have.value", startDate.format("HH:mm"));

    // check end time
    cy.get("input")
      .filter("[data-test='endTime']")
      //default duration is 1 hour
      .should("have.value", startDate.add(1, "hour").format("HH:mm"))
      //EDIT endTime
      .type("14:30");

    // check end time after edit
    cy.get("input")
      .filter("[data-test='endTime']")
      .should("have.value", startDate.hour(14).minute(30).format("HH:mm"))
      .and("have.attr", "aria-invalid", "false");

    // check reserve button
    cy.get("button").contains("Prenota").should("be.enabled");
  });

  it("GIVEN logged user WHEN reservation start time is in the past THEN show warning and cannot press button", () => {
    // fixed time of a PAST date.
    const startDate = dayjs()
      .subtract(1, "day")
      .hour(13)
      .minute(0)
      .second(0)
      .millisecond(0);

    mountComponent(startDate, session);

    // endTime is disabled
    cy.get("input")
      .filter("[data-test='endTime']")
      .should("have.attr", "disabled");

    // show warning
    cy.get(".MuiBox-root > .MuiPaper-root").should(
      "contain",
      "Non puoi prenotare una data nel passato"
    );

    // reserve button is disabled
    cy.get("button").contains("Prenota").should("have.attr", "disabled");
  });

  it("GIVEN logged user WHEN reservation is longer than 2 hours THEN show error and cannot press button", () => {
    // fixed time of a future date. TIME: 13:00
    const startDate = dayjs()
      .add(1, "day")
      .hour(13)
      .minute(0)
      .second(0)
      .millisecond(0);

    mountComponent(startDate, session);

    //try to reserve for 2h30min, not allowed
    cy.get("input").filter("[data-test='endTime']").type("15:30");

    // check end time after edit and error status
    cy.get("input")
      .filter("[data-test='endTime']")
      .filter(":focus")
      .should("have.value", startDate.hour(15).minute(30).format("HH:mm"))
      .should("have.attr", "aria-invalid", "true");
    // check error message
    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "Prenota al massimo 2 ore. Rispetta l'orario di chiusura del circolo"
    );

    // reserve button is disabled
    cy.get("[data-test='reserve-button']").should("be.disabled");
  });

  it("GIVEN logged user WHEN reservation end time is after club closing time THEN show error and cannot press button", () => {
    function testBody(clubClosingMinute: number) {
      //TIME: LAST BOOKABLE HOUR = 20:30
      const customClubSettings = {
        ...clubSettings,
        lastBookableHour: 20,
        lastBookableMinute: clubClosingMinute,
      };
      const startDate = dayjs()
        .add(1, "day")
        .hour(customClubSettings.lastBookableHour)
        .minute(customClubSettings.lastBookableMinute)
        .second(0)
        .millisecond(0);
      cy.log("CLUB LAST BOOKABLE SLOT", startDate.format("HH:mm"));

      let endDate = startDate.add(1, "hour").format("HH:mm");

      //enter last allowed endTime: LAST BOOKABLE HOUR + 1h = 21:30
      mountComponent(startDate, session, customClubSettings);
      cy.get("input").filter("[data-test='endTime']").type(endDate);
      cy.get("[data-test='endTime']")
        .should("have.value", endDate)
        .and("have.attr", "aria-invalid", "false");

      //enter invalid hour, after closing time: LAST BOOKABLE HOUR + 1.5h = 22:00
      mountComponent(startDate, session, customClubSettings);
      endDate = startDate
        .add(dayjs.duration({ hours: 1, minutes: 30 }))
        .format("HH:mm");
      cy.get("input").filter("[data-test='endTime']").type(endDate);
      cy.get("[data-test='endTime']")
        .should("have.value", endDate)
        .and("have.attr", "aria-invalid", "true");
      // check error message
      cy.get(".MuiFormHelperText-root").should(
        "have.text",
        "Prenota al massimo 2 ore. Rispetta l'orario di chiusura del circolo"
      );

      //enter invalid hour, after closing time: LAST BOOKABLE HOUR + 2h = 22:30
      mountComponent(startDate, session, customClubSettings);
      endDate = startDate
        .add(dayjs.duration({ hours: 2, minutes: 0 }))
        .format("HH:mm");
      cy.get("input").filter("[data-test='endTime']").type(endDate);
      cy.get("[data-test='endTime']")
        .should("have.value", endDate)
        .and("have.attr", "aria-invalid", "true");
      // check error message
      cy.get(".MuiFormHelperText-root").should(
        "have.text",
        "Prenota al massimo 2 ore. Rispetta l'orario di chiusura del circolo"
      );
    }
    // repeat test for all possible club closing minutes
    testBody(30);
    testBody(0);
  });
});
