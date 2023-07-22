import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { SessionProvider } from "next-auth/react";
import ReserveDialog from "~/components/ReserveDialog";
import { UserRoles } from "~/utils/constants";

describe("<Reservation Dialog />", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("GIVEN I am not logged in WHEN dialog THEN show login button", () => {
    cy.mount(
      <SessionProvider session={null}>
        <ReserveDialog
          open={true}
          clubId="clubId"
          date={undefined}
          resource={undefined}
          onConfirm={() => null}
          onDialogClose={() => null}
        />
      </SessionProvider>
    );
    cy.get("h2").should("contain", "Prenota");
    cy.get(".MuiButtonBase-root").should("contain", "Effettua il login");
  });

  const session = {
    expires: "2023-10-20T11:00:00.000Z",
    user: {
      id: "test",
      name: "test",
      email: "",
      role: UserRoles.USER,
    },
  };

  it("GIVEN I am logged in, WHEN I reserve one hour in the future THEN succed", () => {
    // fixed time of a future date.
    const startDate = dayjs()
      .add(1, "day")
      .hour(13)
      .minute(0)
      .second(0)
      .millisecond(0);

    cy.mount(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SessionProvider session={session}>
          <ReserveDialog
            open={true}
            clubId="clubId"
            date={startDate.toDate()}
            resource={"Campo 1"}
            onConfirm={(endDate) => console.log("end date :", endDate)}
            onDialogClose={() => null}
          />
        </SessionProvider>
      </LocalizationProvider>
    );
    cy.get("h2").should("contain", "Prenota");

    cy.get("input")
      .filter("[data-test='date']")
      .should("have.value", startDate.format("DD/MM/YYYY"));

    cy.get("input")
      .filter("[data-test='startTime']")
      .should("have.value", startDate.format("HH:mm"));

    cy.get("input")
      .filter("[data-test='endTime']")
      .should("have.value", startDate.add(1, "hour").format("HH:mm")) //default duration is 1 hour
      .focus()
      .type("14:30");

    cy.get("input")
      .filter("[data-test='endTime']")
      .should("have.value", startDate.hour(14).minute(30).format("HH:mm")); //end date is updated

    cy.get("button").contains("Prenota").should("be.enabled");

    //check that the dialog is closed
  });

  it("GIVEN I am logged in, WHEN I try to reserve one hour in the past THEN show warning and not succeed", () => {
    // fixed time of a PAST date.
    const startDate = dayjs()
      .add(-1, "day")
      .hour(13)
      .minute(0)
      .second(0)
      .millisecond(0);

    cy.mount(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SessionProvider session={session}>
          <ReserveDialog
            open={true}
            clubId="clubId"
            date={startDate.toDate()}
            resource={"Campo 1"}
            onConfirm={(endDate) => console.log("end date :", endDate)}
            onDialogClose={() => null}
          />
        </SessionProvider>
      </LocalizationProvider>
    );
    cy.get("h2").should("contain", "Prenota");

    cy.get("input")
      .filter("[data-test='date']")
      .should("have.value", startDate.format("DD/MM/YYYY"));

    cy.get("input")
      .filter("[data-test='startTime']")
      .should("have.value", startDate.format("HH:mm"));

    cy.get("input")
      .filter("[data-test='endTime']")
      .should("have.attr", "disabled");

    cy.get(".MuiBox-root > .MuiPaper-root").should(
      "contain",
      "Non puoi prenotare una data nel passato"
    );

    cy.get("button").contains("Prenota").should("have.attr", "disabled");

    //check that the dialog is closed
  });

  it("GIVEN I am logged in, WHEN I reserve more than 2 hours in the future THEN not succeed", () => {
    // fixed time of a future date.
    const startDate = dayjs()
      .add(1, "day")
      .hour(13)
      .minute(0)
      .second(0)
      .millisecond(0);

    cy.mount(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SessionProvider session={session}>
          <ReserveDialog
            open={true}
            clubId="clubId"
            date={startDate.toDate()}
            resource={"Campo 1"}
            onConfirm={(endDate) => console.log("end date :", endDate)}
            onDialogClose={() => null}
          />
        </SessionProvider>
      </LocalizationProvider>
    );
    cy.get("h2").should("contain", "Prenota");

    cy.get("input")
      .filter("[data-test='date']")
      .should("have.value", startDate.format("DD/MM/YYYY"));

    cy.get("input")
      .filter("[data-test='startTime']")
      .should("have.value", startDate.format("HH:mm"));

    cy.get("input").filter("[data-test='endTime']").focus().type("15:30"); //2:30 hour, not allowed

    cy.get("input")
      .filter("[data-test='endTime']")
      .filter(":focus")
      .should("have.value", startDate.hour(15).minute(30).format("HH:mm"))
      .should("have.attr", "aria-invalid", "true");

    cy.get("button").contains("Prenota").should("have.attr", "disabled");

    //check that the dialog is closed
  });
});
