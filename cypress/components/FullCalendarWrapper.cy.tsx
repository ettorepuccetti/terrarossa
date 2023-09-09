import { type inferRouterOutputs } from "@trpc/server";
import FullCalendarWrapper from "~/components/FullCalendarWrapper";
import { type AppRouter } from "~/server/api/root";
import { formatTimeString } from "~/utils/utils";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ClubData = RouterOutput["club"]["getByClubId"];
type CourtData = RouterOutput["court"]["getAllByClubId"];

describe("<FullCalendarWrapper />", () => {
  beforeEach("build club, clubSetting and court objects", () => {
    cy.queryFilteredClubs("foro italico").then((club) => {
      if (!club[0]) {
        throw new Error("Club not found");
      }
      cy.getClubSettings(club[0].clubSettingsId).then((clubSettings) => {
        if (!clubSettings || !club[0]) {
          throw new Error("Club settings not found");
        }
        const courtData: CourtData = [
          {
            clubId: club[0].id,
            id: "1",
            name: "Campo 1",
            beginTime: "BOTH",
            indoor: true,
            surface: "CLAY",
          },
          {
            clubId: club[0].id,
            id: "2",
            name: "Campo 2",
            beginTime: "BOTH",
            indoor: true,
            surface: "CLAY",
          },
        ];
        const clubData: ClubData = {
          ...club[0],
          clubSettings: clubSettings,
        };

        cy.wrap(clubData).as("clubData");
        cy.wrap(courtData).as("courtData");
      });
    });
  });
  it("GIVEN club with reservation first and last hour WHEN select first and second last slot THEN constrains respected", function () {
    const testBody = (closingMinute: number, lastSlotLabelSelector: string) => {
      cy.log("CLUB LAST BOOKABLE SLOT (minutes)", closingMinute);

      const clubData = this.clubData as ClubData;

      cy.mount(
        <FullCalendarWrapper
          clubData={{
            ...clubData,
            clubSettings: {
              ...clubData.clubSettings,
              lastBookableMinute: closingMinute,
            },
          }}
          courtData={this.courtData as CourtData}
          onDateClick={() => alert("date click")}
          onEventClick={() => null}
          reservationData={[]}
        />
      );

      // check time of the first slot
      cy.get(
        ":nth-child(1) > .fc-timegrid-slot > .fc-timegrid-slot-label-frame > .fc-timegrid-slot-label-cushion"
      ).should(
        "have.text",
        formatTimeString(
          (this.clubData as ClubData).clubSettings.firstBookableHour,
          (this.clubData as ClubData).clubSettings.firstBookableMinute,
          1
        )
      );

      // check time of the second last slot (containing the last bookable hour)
      cy.get(lastSlotLabelSelector).should(
        "have.text",
        formatTimeString(
          (this.clubData as ClubData).clubSettings.lastBookableHour,
          (this.clubData as ClubData).clubSettings.lastBookableMinute,
          1
        )
      );
    };
    // repeat test for different closing minutes
    testBody(
      0,
      ":nth-last-child(2) > .fc-timegrid-slot > .fc-timegrid-slot-label-frame > .fc-timegrid-slot-label-cushion"
    );
    testBody(
      30,
      ":nth-last-child(3) > .fc-timegrid-slot > .fc-timegrid-slot-label-frame > .fc-timegrid-slot-label-cushion"
    );
  });
});
