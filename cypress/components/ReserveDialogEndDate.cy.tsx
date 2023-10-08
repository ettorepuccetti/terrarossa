import { type ClubSettings } from "@prisma/client";
import dayjs from "dayjs";
import ReserveDialogEndDate from "~/components/ReserveDialogEndDate";
import { mountWithContexts, session } from "./constants";

describe("ReserveDialogEndDate", () => {
  beforeEach("Mount", () => {
    const setDateStub = cy.stub().as("setDateStub");
    const setErrorStub = cy.stub().as("setErrorStub");

    const startDate = dayjs()
      .set("hour", 12)
      .set("minute", 0)
      .second(0)
      .millisecond(0);

    mountWithContexts(
      <ReserveDialogEndDate
        disabled={false}
        clubSettings={
          { lastBookableMinute: 0, lastBookableHour: 22 } as ClubSettings
        }
        clubId={"1"}
        startDate={startDate}
        endDateEventHandler={setDateStub}
        endDateErrorEventHandler={setErrorStub}
        endDate={startDate.add(1, "hours")}
      />,
      session
    );
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
