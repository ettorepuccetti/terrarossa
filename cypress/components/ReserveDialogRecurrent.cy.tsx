import dayjs from "dayjs";
import { type Session } from "next-auth";
import ReserveDialogRecurrent from "~/components/ReserveDialogRecurrent";
import { getAdminSession, mountWithContexts } from "./constants";

describe("ReserveDialogRecurrent", () => {
  beforeEach("Mount", () => {
    const clubId = "1";
    const adminSession: Session = getAdminSession(clubId);

    const setDateStub = cy.stub().as("setDateStub");
    const setErrorStub = cy.stub().as("setErrorStub");
    mountWithContexts(
      <ReserveDialogRecurrent
        clubId={"1"}
        startDate={dayjs()}
        recurrentDateEventHandler={setDateStub}
        recurrentDateErrorEventHandler={setErrorStub}
        recurrentEndDate={null}
      />,
      adminSession
    );
  });

  it("return error on first switch with null date", () => {
    cy.get("[data-test=recurrent-switch]").click();
    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "Inserisci una data valida"
    );
    cy.get("@setErrorStub").should("be.calledOnceWithExactly", true);
  });

  it("reset the error when the switch is turned off", () => {
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("@setErrorStub").should("be.calledWithExactly", false);
  });

  it("return no error when inserted a valid date", () => {
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().add(1, "week").format("DD/MM/YYYY")
    );
    cy.get("@setDateStub").should(
      "be.calledWith",
      dayjs().add(1, "week").hour(0).minute(0).second(0).millisecond(0)
    );
    cy.get("@setErrorStub").should("be.calledWithExactly", false);
  });

  it("return error when inserted a date before the start date", () => {
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().subtract(1, "week").format("DD/MM/YYYY")
    );
    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "La data di fine validità deve essere successiva alla data di inizio"
    );
    cy.get("@setDateStub").should(
      "be.calledWith",
      dayjs().subtract(1, "week").hour(0).minute(0).second(0).millisecond(0)
    );
    cy.get("@setErrorStub").should("be.calledWithExactly", true);
  });

  it("when specific error and switch is turned off and on, the error is still present", () => {
    // enable switch
    cy.get("[data-test=recurrent-switch]").click();
    // enter invalid date
    cy.get("[data-test=recurrent-end-date]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().subtract(1, "week").format("DD/MM/YYYY")
    );
    // check error is send
    cy.get("@setErrorStub").should("be.calledWithExactly", true);
    // disable switch
    cy.get("[data-test=recurrent-switch]").click();
    // check error is cleared
    cy.get("@setErrorStub").should("be.calledWithExactly", false);
    // enable switch
    cy.get("[data-test=recurrent-switch]").click();
    // check error is still present and send again
    cy.get(".MuiFormHelperText-root").should(
      "have.text",
      "La data di fine validità deve essere successiva alla data di inizio"
    );
    cy.get("@setErrorStub").should("be.calledWithExactly", true);
  });
});
