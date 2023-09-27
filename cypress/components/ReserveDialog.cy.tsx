import { type ClubSettings } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { type Session } from "next-auth";
import ReserveDialog from "~/components/ReserveDialog";
import {
  clubSettings,
  getAdminSession,
  mountWithContexts,
  session,
} from "./constants";
dayjs.extend(duration);

const mountComponent = ({
  startDate,
  session,
  clubId = "my_club_Id",
  clubSettings: clubSettingsInput = clubSettings,
}: {
  startDate: Dayjs | undefined;
  session: Session | undefined;
  clubId?: string;
  clubSettings?: ClubSettings;
}) => {
  mountWithContexts(
    <ReserveDialog
      open={true}
      clubId={clubId}
      startDate={startDate?.toDate()}
      resource={"Campo 1"}
      onConfirm={(endDate) => console.log("end date :", endDate)}
      onDialogClose={() => null}
      clubSettings={clubSettingsInput}
    />,
    session
  );
  if (!startDate) {
    return;
  }
  // wait for the useEffect hook to set the endTime
  cy.get("input")
    .filter("[data-test='endTime']")
    .should("have.value", startDate?.add(1, "hour").format("HH:mm"));
};

describe("USER", () => {
  it("GIVEN I am not logged in WHEN dialog THEN show login button", () => {
    mountComponent({ startDate: undefined, session: undefined });
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

    mountComponent({ startDate, session });

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

    mountComponent({ startDate, session });

    // endTime is disabled
    cy.get("input")
      .filter("[data-test='endTime']")
      .should("have.attr", "disabled");

    // show warning
    cy.get("[data-test=past-warning]").should(
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

    mountComponent({ startDate, session });

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
    cy.get("[data-test=reserveButton]").should("be.disabled");
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
      mountComponent({ startDate, session, clubSettings: customClubSettings });
      cy.get("input").filter("[data-test='endTime']").type(endDate);
      cy.get("[data-test='endTime']")
        .should("have.value", endDate)
        .and("have.attr", "aria-invalid", "false");

      //enter invalid hour, after closing time: LAST BOOKABLE HOUR + 1.5h = 22:00
      mountComponent({ startDate, session, clubSettings: customClubSettings });
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
      mountComponent({ startDate, session, clubSettings: customClubSettings });
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

  it("GIVEN logged user WHEN end time or start time is not 00 or 30 THEN show error cannot press button", () => {
    const startDate = dayjs().add(1, "day").hour(13).minute(0);

    mountComponent({ startDate, session });

    //try to enter duration 1h:12m
    const endDate = startDate
      .add(dayjs.duration({ hours: 1, minutes: 12 }))
      .format("HH:mm");
    cy.get("input").filter("[data-test='endTime']").type(endDate);

    // check end time after edit
    cy.get("[data-test='endTime']")
      .should("have.value", endDate)
      .and("have.attr", "aria-invalid", "true");
    // check error message
    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "Prenota 1 ora, 1 ora e mezzo o 2 ore"
    );
    // check button disabled
    cy.get("[data-test=reserveButton]").should("be.disabled");
  });

  describe("ADMIN", () => {
    beforeEach(() => {
      const clubId = "my_club_Id";
      const adminSession = getAdminSession(clubId);
      mountComponent({
        startDate: dayjs().hour(13).minute(0).second(0).millisecond(0),
        session: adminSession,
        clubId: clubId,
      });
    });

    it("GIVEN admin WHEN reserve THEN can book more than 2 hours", () => {
      cy.get("input").filter("[data-test='endTime']").type("18:00");
      cy.get("[data-test='endTime']").should(
        "have.attr",
        "aria-invalid",
        "false"
      );
      cy.get("[data-test=reserveButton]").should("be.enabled");
    });

    describe("RECURRENT RESERVATION", () => {
      it("GIVEN admin WHEN enable recurrent reervation toggle THEN show recurrent end date", () => {
        cy.get("[data-test=recurrent-switch]").click();
        cy.get("[data-test=recurrent-end-date]").should("be.visible");
      });

      it("GIVEN admin WHEN enable recurrent switch but not set end date THEN button disabled", () => {
        cy.get("[data-test=recurrent-switch]").click();
        cy.get("[data-test=reserveButton]").should("be.disabled");
      });

      it("GIVEN admin WHEN enable recurrent switch and set end date THEN button enabled", () => {
        cy.get("[data-test=recurrent-switch]").click();
        cy.get("[data-test=recurrent-end-date]").type(
          dayjs().add(1, "week").format("DD/MM/YYYY")
        );
        cy.get("[data-test=reserveButton]").should("be.enabled");
      });

      it("GIVEN admin WHEN set recurrent end date not same week day THEN show error and button disabled", () => {
        cy.get("[data-test=recurrent-switch]").click();
        cy.get("[data-test=recurrent-end-date]").type(
          dayjs().add(8, "day").format("DD/MM/YYYY")
        );
        cy.get("[data-test=reserveButton]").should("be.disabled");
        cy.get("[data-test=recurrent-end-date]").should(
          "have.attr",
          "aria-invalid",
          "true"
        );
        cy.get(".MuiFormHelperText-root").should(
          "have.text",
          "La data deve essere lo stesso giorno della settimana della prenotazione"
        );
        cy.get("[data-test=reserveButton]").should("be.disabled");
      });

      it("GIVEN admin WHEN set recurrent end date next year THEN show error and button disabled", () => {
        cy.get("[data-test=recurrent-switch]").click();
        const dayOfTheWeek = dayjs().day();
        cy.get("[data-test=recurrent-end-date]").type(
          dayjs().add(1, "year").month(0).day(dayOfTheWeek).format("DD/MM/YYYY")
        );
        cy.get("[data-test=reserveButton]").should("be.disabled");
        cy.get("[data-test=recurrent-end-date]").should(
          "have.attr",
          "aria-invalid",
          "true"
        );
        cy.get(".MuiFormHelperText-root").should(
          "have.text",
          "La data di fine validità deve essere entro la fine dell'anno"
        );
        cy.get("[data-test=reserveButton]").should("be.disabled");
      });

      it("GIVEN admin WHEN set valid recurrent end date (without typing) THEN button enabled", () => {
        cy.viewport(500, 800);
        cy.get("[data-test=recurrent-switch]").click();
        cy.get("[data-test=reserveButton]").should("be.disabled");

        cy.get("[data-test=recurrent-end-date]").click();
        cy.get("[data-testid=CalendarIcon]").click();
        cy.get(".MuiPickersDay-today").click();
        cy.get("[data-test=reserveButton]").should("be.enabled");
      });
    });
  });
});
