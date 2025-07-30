import FullCalendarWrapper from "~/components/FullCalendarWrapper";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { formatTimeString } from "~/utils/utils";
import {
  club,
  clubSettings,
  courts,
  mountWithContexts,
  session,
} from "./_constants";

function FullCalendarWrapperContext(props: { lastBookableMinute: number }) {
  // set clubData
  useMergedStoreContext((state) => state.setClubData)({
    ...club,
    Address: null,
    PhoneNumber: null,
    clubSettings: {
      ...clubSettings,
      lastBookableMinute: props.lastBookableMinute,
    },
  });
  return <FullCalendarWrapper courtData={courts} reservationData={[]} />;
}

describe("<FullCalendarWrapper />", () => {
  beforeEach("build club, clubSetting and court objects", () => {
    // avoid to have error in console
    cy.intercept("GET", "/api/auth/session", { body: {} });
  });

  describe("GIVEN club with reservation time constrains WHEN select first and 2nd-last slot THEN constrains respected", () => {
    [
      { closingMinute: 0, nthLastSlotSelector: 2 },
      { closingMinute: 30, nthLastSlotSelector: 3 },
    ].forEach(({ closingMinute, nthLastSlotSelector }) => {
      it(`closingMinute: ${closingMinute}`, function () {
        cy.log("CLUB LAST BOOKABLE SLOT (minutes)", closingMinute);

        mountWithContexts(
          <FullCalendarWrapperContext lastBookableMinute={closingMinute} />,
          session,
        );

        // check time of the first slot
        cy.get(
          ":nth-child(1) > .fc-timegrid-slot > .fc-timegrid-slot-label-frame > .fc-timegrid-slot-label-cushion",
        ).should(
          "have.text",
          formatTimeString(clubSettings.firstBookableHour, 0, false),
        );

        // check time of the second last slot (containing the last bookable hour)
        cy.get(
          `:nth-last-child(${nthLastSlotSelector}) > .fc-timegrid-slot > .fc-timegrid-slot-label-frame > .fc-timegrid-slot-label-cushion`,
        ).should(
          "have.text",
          formatTimeString(clubSettings.lastBookableHour, 0, false),
        );
      });
    });
  });
});
