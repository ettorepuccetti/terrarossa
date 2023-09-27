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

  it("GIVEN date null and switch off WHEN switch on THEN set error", () => {
    cy.get("[data-test=recurrent-switch]").click();
    // cy.get(".MuiFormHelperText-root").should(
    //   "have.text",
    //   "Inserisci una data valida"
    // );
    cy.get("@setErrorStub").should("be.calledOnceWithExactly", true);
  });

  it("GIVEN switch on WHEN switch off THEN clear error", () => {
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("@setErrorStub").should("be.calledWithExactly", false);
  });

  it("GIVEN switch on and null date WHEN type valid date THEN clear error", () => {
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

  it("GIVEN switch on WHEN type invalid date THEN error set", () => {
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

  it("GIVEN invalid date and switch on WHEN switch off and on THEN error set", () => {
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

  it("GIVEN null date and switch on WHEN set valid date (without typing) THEN error clear", () => {
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").click();
    cy.get("[data-testid=CalendarIcon]").click();
    cy.get(".MuiPickersDay-today").click();

    cy.get("@setDateStub").should(
      "be.calledWith",
      dayjs().hour(0).minute(0).second(0).millisecond(0)
    );
    cy.get("@setErrorStub").should("be.calledWithExactly", false);
  });

  it("GIVEN switch on and valid date WHEN clear date THEN error set", () => {
    cy.get("[data-test=recurrent-switch]").click();
    cy.get("[data-test=recurrent-end-date]").click();
    cy.get("[data-test=recurrent-end-date]").type(
      dayjs().add(1, "week").format("DD/MM/YYYY")
    );

    //clear the three fields of the date
    cy.get("[data-test=recurrent-end-date]")
      .clear()
      .type("{leftarrow}")
      .clear()
      .type("{leftarrow}")
      .clear();

    cy.get("@setDateStub").should("be.calledWithExactly", null);
    cy.get("@setErrorStub").should("be.calledWithExactly", true);
  });
});
