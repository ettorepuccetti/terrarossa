import { type DateClickArg } from "@fullcalendar/interaction";
import { type ClubSettings } from "@prisma/client";
import dayjs from "dayjs";
import ReserveDialogEndDate from "~/components/ReserveDialogEndDate";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { club, clubSettings, mountWithContexts, session } from "./_constants";

function ReserveDialogEndDateContext() {
  //setting clubData
  useMergedStoreContext((state) => state.setClubData)({
    clubSettings: clubSettings,
    Address: null,
    phoneNumber: null,
    ...club,
  });

  //setting stubs
  const setDateStub = cy.stub().as("setDateStub");
  const setErrorStub = cy.stub().as("setErrorStub");
  useMergedStoreContext((store) => store.setSetEndDate)(setDateStub);
  useMergedStoreContext((store) => store.setSetEndDateError)(setErrorStub);

  //setting dateClick
  const startDate = dayjs()
    .add(1, "day")
    .set("hour", 12)
    .set("minute", 0)
    .second(0)
    .millisecond(0);
  const dateClick: DateClickArg = {
    date: startDate.toDate(),
    resource: {
      id: "court1",
      title: "Campo 1",
    },
  } as DateClickArg;
  useMergedStoreContext((store) => store.setDateClick)(dateClick);

  return (
    <ReserveDialogEndDate
      clubSettings={
        { lastBookableMinute: 0, lastBookableHour: 22 } as ClubSettings
      }
    />
  );
}

describe("ReserveDialogEndDate", () => {
  beforeEach("Mount", () => {
    mountWithContexts(<ReserveDialogEndDateContext />, session);
  });

  it("GIVEN valid end date WHEN clear end date THEN set error", () => {
    cy.get("input").filter("[data-test='endTime']").clear();
    cy.get("@setDateStub").should("be.calledWith", null);
    cy.get("@setErrorStub").should("be.calledWith", true);
  });

  it("GIVEN null end date WHEN insert valid endDate THEN clear error", () => {
    cy.get("input").filter("[data-test='endTime']").clear();
    cy.get("@setErrorStub").should("be.calledWith", true);

    cy.get("input").filter("[data-test='endTime']").type("14:00");
    cy.get("@setErrorStub").should("be.calledWith", false);
  });

  it("GIVEN invalid end date WHEN type valid endDate THEN set error", () => {
    cy.get("[data-test='endTime']").clear();

    cy.get("input").filter("[data-test='endTime']").type("13:01");
    cy.get("@setErrorStub").should("be.calledWith", true);

    cy.get("input").filter("[data-test='endTime']").clear();
    cy.get("input").filter("[data-test='endTime']").type("00");
    cy.get("@setErrorStub").should("be.calledWith", false);
  });

  it("GIVEN invalid end date WHEN clear endDate THEN error still set", () => {
    cy.get("[data-test='endTime']").clear();
    cy.get("input").filter("[data-test='endTime']").type("13:01");

    cy.get("input")
      .filter("[data-test='endTime']")
      .clear()
      .type("{leftarrow}")
      .clear();
    cy.get("@setErrorStub").should("be.calledWithExactly", true);
  });
});
