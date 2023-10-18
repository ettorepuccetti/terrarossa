import { type Session } from "next-auth";
import HorizontalDatePicker from "~/components/HorizontalDatePicker";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { type RouterOutputs } from "~/utils/api";
import {
  buildTrpcQueryMock,
  club,
  clubSettings,
  getAdminSession,
  mountWithContexts,
} from "./_constants";

function HorizonalDatePickerContext(props: {
  session: Session;
  clubId: string;
}) {
  // set club data
  useCalendarStoreContext((store) => store.setClubData)({
    ...club,
    id: props.clubId,
    clubSettings: {
      ...clubSettings,
    },
  });

  const reservationData: RouterOutputs["reservationQuery"]["getAllVisibleInCalendarByClubId"] =
    [];
  // set reservation query
  useCalendarStoreContext((store) => store.setReservationQuery)(
    buildTrpcQueryMock(reservationData),
  );
  return <HorizontalDatePicker />;
}

const mountComponent = (props: { session: Session; clubId: string }) => {
  // to avoid error in console
  // cy.intercept("GET", "/api/auth/session", { body: [] });
  return mountWithContexts(
    <HorizonalDatePickerContext {...props} />,
    props.session,
  );
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
  it("render", () => {
    cy.getByDataTest("selected-date-extended").should("exist");
  });
});
