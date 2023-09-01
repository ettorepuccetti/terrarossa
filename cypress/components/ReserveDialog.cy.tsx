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
          startDate={undefined}
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
    expires: "2022-10-20T11:00:00.000Z",
    user: {
      id: "test",
      name: "test",
      email: "",
      role: UserRoles.USER,
    },
  };

  it("GIVEN logged user WHEN reserve one hour in the future THEN can press reserve button", () => {
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
            startDate={startDate.toDate()}
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
      .type("14:30");

    cy.get("input")
      .filter("[data-test='endTime']")
      .should("have.value", startDate.hour(14).minute(30).format("HH:mm")); //end date is updated

    cy.get("button").contains("Prenota").should("be.enabled");
  });

  it("GIVEN logged user WHEN reservation start time is in the past THEN show warning and cannot press button", () => {
    // fixed time of a PAST date.
    const startDate = dayjs()
      .subtract(1, "day")
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
            startDate={startDate.toDate()}
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
  });

  it("GIVEN logged user WHEN reservation is longer than 2 hours THEN show warning and cannot press button", () => {
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
            startDate={startDate.toDate()}
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

    //2:30 hour, not allowed
    cy.get("input").filter("[data-test='endTime']").type("15:30");

    cy.get("input")
      .filter("[data-test='endTime']")
      .filter(":focus")
      .should("have.value", startDate.hour(15).minute(30).format("HH:mm"))
      .should("have.attr", "aria-invalid", "true");

    cy.get("[data-test='reserve-button']").should("be.disabled");
  });
});
