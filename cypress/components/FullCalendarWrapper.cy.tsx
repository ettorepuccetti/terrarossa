import { type inferRouterOutputs } from "@trpc/server";
import FullCalendarWrapper from "~/components/FullCalendarWrapper";
import { type AppRouter } from "~/server/api/root";
import { formatTimeString } from "~/utils/utils";
import { club, clubSettings, courts, mountWithContexts } from "./_constants";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ClubData = RouterOutput["club"]["getByClubId"];
type CourtData = RouterOutput["court"]["getAllByClubId"];

describe("<FullCalendarWrapper />", () => {
  beforeEach("build club, clubSetting and court objects", () => {
    const clubData: ClubData = {
      ...club,
      clubSettings: clubSettings,
    };
    const courtData: CourtData = courts;

    cy.wrap(clubData).as("clubData");
    cy.wrap(courtData).as("courtData");

    // just to avoid error in console
    cy.intercept("GET", "/api/auth/session", { body: {} });
  });

  describe("GIVEN club with reservation first and last hour WHEN select first and second last slot THEN constrains respected", () => {
    [
      { closingMinute: 0, nthLastSlotSelector: 2 },
      { closingMinute: 30, nthLastSlotSelector: 3 },
    ].forEach(({ closingMinute, nthLastSlotSelector }) => {
      it(`closingMinute: ${closingMinute}`, function () {
        cy.log("CLUB LAST BOOKABLE SLOT (minutes)", closingMinute);

        const clubData = this.clubData as ClubData;
        mountWithContexts(
          <FullCalendarWrapper
            clubData={{
              ...clubData,
              clubSettings: {
                ...clubData.clubSettings,
                lastBookableMinute: closingMinute,
              },
            }}
            courtData={this.courtData as CourtData}
            reservationData={[]}
          />,
        );

        // check time of the first slot
        cy.get(
          ":nth-child(1) > .fc-timegrid-slot > .fc-timegrid-slot-label-frame > .fc-timegrid-slot-label-cushion",
        ).should(
          "have.text",
          formatTimeString(
            (this.clubData as ClubData).clubSettings.firstBookableHour,
            (this.clubData as ClubData).clubSettings.firstBookableMinute,
            0,
          ),
        );

        // check time of the second last slot (containing the last bookable hour)
        cy.get(
          `:nth-last-child(${nthLastSlotSelector}) > .fc-timegrid-slot > .fc-timegrid-slot-label-frame > .fc-timegrid-slot-label-cushion`,
        ).should(
          "have.text",
          formatTimeString(
            (this.clubData as ClubData).clubSettings.lastBookableHour,
            (this.clubData as ClubData).clubSettings.lastBookableMinute,
            0,
          ),
        );
      });
    });
  });
});
