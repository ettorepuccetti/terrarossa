import { type ClubSettings } from "@prisma/client";
import dayjs from "dayjs";
import {
  allEnglandClubName,
  foroItalicoName,
  pietrangeliCourtName,
} from "~/utils/constants";
import {
  ADMIN_FORO,
  USER1,
  loginAndVisitCalendarPage,
  saveClubInfoAndCleanReservations,
} from "./_constants";

beforeEach("Retrieve clubs and delete reservations (no login)", function () {
  saveClubInfoAndCleanReservations(
    foroItalicoName,
    "clubIdForoItalico",
    "foroItalico",
    "clubSettingsForoItalico"
  );
  saveClubInfoAndCleanReservations(
    allEnglandClubName,
    "clubIdAllEngland",
    "allEngland",
    "clubSettingsAllEngland"
  );
});

describe("New Reservation", () => {
  describe("GIVEN logged in user WHEN select a free slot THEN he can make a reservation", () => {
    [USER1, ADMIN_FORO].forEach((user) => {
      it(`Testing for ${user.type}`, function () {
        //initial setup
        loginAndVisitCalendarPage(
          user.username,
          user.password,
          this.clubIdForoItalico as string
        );

        cy.navigateDaysFromToday(2);

        cy.clickOnCalendarSlot(pietrangeliCourtName, 11, 0);

        // save startTime
        cy.get("[data-test='startTime']").invoke("val").as("startTime");

        // save endTime
        cy.get("[data-test='endTime']")
          .wait(100) //wait for the rerender
          .invoke("val")
          .as("endTime");

        // reserve and close the dialog
        cy.get("[data-test=reserveButton]").click();

        // reservation is added
        cy.get("[data-test=calendar-event]").should("be.visible");
      });
    });
  });

  describe("GIVEN logged user WHEN reserve with a clash THEN show error banner and reservation not added", () => {
    [USER1, ADMIN_FORO].forEach((user) => {
      it(`Testing for ${user.type}`, function () {
        //initial setup
        loginAndVisitCalendarPage(
          user.username,
          user.password,
          this.clubIdForoItalico as string
        );
        // create a reservation in the next day, for avoiding `reservation in the past` warning
        const startDate = dayjs()
          .add(1, "day")
          .hour(12)
          .minute(0)
          .second(0)
          .millisecond(0);

        cy.addReservationToDB(
          startDate.toDate(),
          startDate.add(1, "hour").toDate(),
          this.clubIdForoItalico as string,
          pietrangeliCourtName,
          Cypress.env("USER1_MAIL") as string
        );

        cy.reload().waitForCalendarPageToLoad();

        cy.navigateDaysFromToday(1);

        cy.clickOnCalendarSlot(pietrangeliCourtName, 11, 0);

        cy.get("[data-test='endTime']").type("12:30");

        cy.get("[data-test=reserveButton]").click();

        cy.get("[data-test='error-alert']")
          .should("be.visible")
          .and(
            "have.text",
            "La tua prenotazione non puo' essere effettuata. Per favore, scegli un orario in cui il campo è libero"
          );
        // close the error dialog
        cy.get(".MuiAlert-action > .MuiButtonBase-root").click();

        // check that no reservation has been added
        cy.get("[data-test='calendar-event']").should("have.length", 1);
      });
    });
  });

  describe("GIVEN logged user WHEN end time or start time is not 00 or 30 THEN show error and reservation not added", () => {
    [USER1, ADMIN_FORO].forEach((user) => {
      it(`Testing for ${user.type}`, function () {
        loginAndVisitCalendarPage(
          user.username,
          user.password,
          this.clubIdForoItalico as string
        );
        cy.navigateDaysFromToday(2);

        cy.clickOnCalendarSlot(pietrangeliCourtName, 11, 0);

        // insert wrong endTime
        cy.get("[data-test='endTime']").type("12:15");

        cy.get(".MuiFormHelperText-root").should(
          "have.text",
          "Prenota 1 ora, 1 ora e mezzo o 2 ore"
        );

        // try to reserve by clicking confirm button
        cy.get("[data-test=reserveButton]").should("be.disabled");
      });
    });
  });
});

describe("Existing reservation", () => {
  describe("GIVEN logged user WHEN click on his reservation THEN show details dialog", () => {
    [USER1, ADMIN_FORO].forEach((user) => {
      it(`testing for ${user.type}`, function () {
        //initial setup
        loginAndVisitCalendarPage(
          user.username,
          user.password,
          this.clubIdForoItalico as string
        );
        const dayInAdvance = 2;
        const startDate = dayjs()
          .add(dayInAdvance, "days")
          .hour(12)
          .minute(0)
          .second(0)
          .millisecond(0);
        cy.addReservationToDB(
          startDate.toDate(),
          startDate.add(1, "hour").toDate(),
          this.clubIdForoItalico as string,
          pietrangeliCourtName,
          user.username
        );
        cy.reload().waitForCalendarPageToLoad();
        cy.navigateDaysFromToday(dayInAdvance);
        // check that the reservation is visible
        cy.get("[data-test='calendar-event']").should("have.length", 1);
        // click on the reservation
        cy.get("[data-test='calendar-event']").click();
        // check that the dialog is visible
        cy.get("[data-test='event-detail-dialog']").should("be.visible");
      });
    });
  });

  describe("GIVEN logged user WHEN select own reservation before the time limit THEN can delete", () => {
    [USER1, ADMIN_FORO].forEach((user) => {
      it(`Testing for ${user.type}`, function () {
        //initial setup
        loginAndVisitCalendarPage(
          user.username,
          user.password,
          this.clubIdForoItalico as string
        );
        let startDateSafeToDelete = dayjs()
          .millisecond(0)
          .second(0)
          .minute(0)
          .add(
            (this.clubSettingsForoItalico as ClubSettings).hoursBeforeCancel +
              1, // add 1 hour to be sure being after the hoursBeforeCancel time limit
            "hour"
          );

        const clubClosingTimeToday = dayjs()
          .hour((this.clubSettingsForoItalico as ClubSettings).lastBookableHour)
          .minute(
            (this.clubSettingsForoItalico as ClubSettings).lastBookableMinute
          )
          .second(0)
          .millisecond(0);
        const clubOpeningTimeTomorrow = dayjs()
          .add(1, "day")
          .hour(
            (this.clubSettingsForoItalico as ClubSettings).firstBookableHour
          )
          .minute(
            (this.clubSettingsForoItalico as ClubSettings).firstBookableMinute
          )
          .second(0)
          .millisecond(0);

        // if the reservation to create falls in the closing time window
        // start it from the opening time of the next day
        if (
          startDateSafeToDelete.isAfter(clubClosingTimeToday) &&
          startDateSafeToDelete.isBefore(clubOpeningTimeTomorrow)
        ) {
          startDateSafeToDelete = dayjs()
            .add(1, "day")
            .hour(
              (this.clubSettingsForoItalico as ClubSettings).firstBookableHour
            )
            .minute(
              (this.clubSettingsForoItalico as ClubSettings).firstBookableMinute
            )
            .second(0)
            .millisecond(0);
        }

        cy.addReservationToDB(
          startDateSafeToDelete.toDate(),
          startDateSafeToDelete.add(1, "hour").toDate(),
          this.clubIdForoItalico as string,
          pietrangeliCourtName,
          user.username
        );
        cy.reload().waitForCalendarPageToLoad();
        cy.navigateDaysFromToday(startDateSafeToDelete.day() - dayjs().day());

        cy.get("[data-test='calendar-event']").click();
        cy.get("[data-test='delete-button']").click();
        cy.get("[data-test='confirm-button']").click();
        cy.get("[data-test='calendar-event']").should("not.exist");
      });
    });
  });

  // not working anymore since opening the dialog refresh the reservation query. FIX by preventing the query to be refreshed
  describe("GIVEN logged user WHEN delete a reservation already deleted THEN show error banner", () => {
    [USER1, ADMIN_FORO].forEach((user) => {
      it.skip(`testing for ${user.type}`, function () {
        //initial setup
        loginAndVisitCalendarPage(
          user.username,
          user.password,
          this.clubIdForoItalico as string
        );

        const startDate = dayjs()
          .add(1, "day")
          .hour(12)
          .minute(0)
          .second(0)
          .millisecond(0);

        cy.addReservationToDB(
          startDate.toDate(),
          startDate.add(1, "hour").toDate(),
          this.clubIdForoItalico as string,
          pietrangeliCourtName,
          user.username
        );

        cy.reload().waitForCalendarPageToLoad();
        cy.navigateDaysFromToday(1);
        cy.get("[data-test='calendar-event']").then(($event) => {
          const eventId = $event.attr("data-id");
          if (!eventId) throw new Error("Event id not found");
          cy.deleteReservationFromDb(eventId);
        });
        cy.get("[data-test='calendar-event']").click();
        cy.get("[data-test='delete-button']").click();
        cy.get("[data-test='confirm-button']").click();
        cy.wait(1000);
        cy.get("[data-test='error-alert']")
          .should("be.visible")
          .and("have.text", "No Reservation found");
      });
    });
  });
});
