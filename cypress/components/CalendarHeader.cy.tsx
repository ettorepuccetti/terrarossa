import dayjs from "dayjs";
import { type Session } from "next-auth";
import CalendarHeader from "~/components/CalendarHeader";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import { type RouterOutputs } from "~/utils/api";
import { capitaliseFirstChar as capitalizeFirstChar } from "~/utils/utils";
import {
  buildTrpcQueryMock,
  club,
  clubSettings,
  getAdminSession,
  mountWithContexts,
} from "./_constants";
require("dayjs/locale/it");
dayjs.locale("it");

function CalendarHeaderContext(props: { session: Session; clubId: string }) {
  // set club data
  useMergedStoreContext((store) => store.setClubData)({
    ...club,
    id: props.clubId,
    clubSettings: {
      ...clubSettings,
    },
    Address: null,
    PhoneNumber: null,
  });

  // set reservation query
  const reservationData: RouterOutputs["reservationQuery"]["getAllVisibleInCalendarByClubId"] =
    [];
  useMergedStoreContext((store) => store.setReservationQuery)(
    buildTrpcQueryMock(reservationData),
  );
  return <CalendarHeader />;
}

const mountComponent = (props: { session: Session; clubId: string }) => {
  // to avoid error in console
  cy.intercept("GET", "/api/auth/session", { body: [] });
  cy.intercept("GET", "/_next/image?*", { fixture: "media/myteam.jpg,null" });
  return mountWithContexts(<CalendarHeaderContext {...props} />, props.session);
};

describe("ADMIN", () => {
  beforeEach(() => {
    const clubId = "clubid_for_which_user_is_admin";
    const adminSession = getAdminSession(clubId);

    mountComponent({
      clubId: clubId,
      session: adminSession,
    });
  });
  it("GIVEN default selection WHEN click on dayCard in range THEN selection updated", () => {
    // select first day card
    cy.getByDataTest("day-card").first().next().click();

    const selectedDate = dayjs().subtract(
      clubSettings.daysInThePastVisible,
      "day",
    );

    // check selected date
    cy.getByDataTest("selected-date-extended").should(
      "have.text",
      capitalizeFirstChar(selectedDate.format("dddd DD MMMM YYYY")),
    );

    // check selection dot
    cy.getByDataTest("dot-day-card").should("have.length", 1);
    cy.getByDataTest("day-card")
      .filter(`:contains(${selectedDate.date()})`)
      .find("[data-test='dot-day-card']")
      .should("be.visible");
  });

  it("GIVEN default selection WHEN select data out of range THEN selection updated", () => {
    //select custom date from date picker
    cy.getByDataTest("day-card").first().click();
    cy.get('[data-testid="ArrowRightIcon"]').click();
    const lastDayOfNextMonthTimestamp = dayjs()
      .add(1, "month")
      .endOf("month")
      .startOf("day");
    cy.get(`[data-timestamp=${lastDayOfNextMonthTimestamp.valueOf()}]`).click();
    cy.get("button").contains("OK").click();

    // check selected date
    cy.getByDataTest("selected-date-extended").should(
      "have.text",
      capitalizeFirstChar(
        lastDayOfNextMonthTimestamp.format("dddd DD MMMM YYYY"),
      ),
    );

    // check selection dot
    cy.getByDataTest("dot-day-card").should("have.length", 1);
    cy.getByDataTest("day-card")
      .first()
      .find("[data-test='dot-day-card']")
      .should("be.visible");
  });

  it("GIVEN custom selection WHEN select data in rage THEN selection updated", () => {
    //select custom date from date picker
    cy.getByDataTest("day-card").first().click();
    cy.get('[data-testid="ArrowRightIcon"]').click();
    const lastDayOfNextMonthTimestamp = dayjs()
      .add(1, "month")
      .endOf("month")
      .startOf("day");
    cy.get(`[data-timestamp=${lastDayOfNextMonthTimestamp.valueOf()}]`).click();
    cy.get("button").contains("OK").click();

    // select date in range (day after today)
    const selectedDate = dayjs().add(1, "day");
    const selectedDateDateStr = selectedDate.date().toString().padStart(2, "0");
    cy.getByDataTest("day-card").contains(selectedDateDateStr).click();

    // check selected date
    cy.getByDataTest("selected-date-extended").should(
      "have.text",
      capitalizeFirstChar(selectedDate.format("dddd DD MMMM YYYY")),
    );

    // check selection dot
    cy.getByDataTest("dot-day-card").should("have.length", 1);
    cy.getByDataTest("day-card")
      .filter(`:contains(${selectedDateDateStr})`)
      .find("[data-test='dot-day-card']")
      .should("be.visible");
  });
});
