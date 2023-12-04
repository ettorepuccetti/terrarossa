import dayjs from "dayjs";
import {
  centralCourtName,
  foroItalicoName,
  pietrangeliCourtName,
} from "~/utils/constants";
import {
  loginAndVisitProfilePage,
  saveClubInfoAndCleanReservations,
} from "./_constants";

describe("profile", () => {
  beforeEach(() => {
    saveClubInfoAndCleanReservations(
      foroItalicoName,
      "clubIdForoItalico",
      "foroItalico",
      "clubSettingsForoItalico",
    );

    loginAndVisitProfilePage(
      Cypress.env("USER1_MAIL") as string,
      Cypress.env("USER1_PWD") as string,
    );
  });

  it("GIVEN a user WHEN the user is logged in THEN profile info are shown", () => {
    cy.getByDataTest("username").should("have.value", "user1");
    cy.getByDataTest("email").should("have.value", Cypress.env("USER1_MAIL"));
  });

  describe("edit username", () => {
    after("Restore original username and image src for user1", () => {
      cy.task("prisma:editUsername", {
        userMail: Cypress.env("USER1_MAIL") as string,
        newUsername: "user1",
      });
    });

    it("GIVEN a user WHEN edit username THEN username is updated", () => {
      const newUsername = "user1 edited";
      cy.getByDataTest("edit-username-button").click();
      cy.getByDataTest("edit-username-input").type(newUsername);
      cy.getByDataTest("submit-username").click();

      cy.getByDataTest("edit-username-dialog").should("not.exist");
      cy.getByDataTest("username").should("have.value", newUsername);
    });

    it("GIVEN a user WHEN edit profile picture THEN network request is sent", () => {
      // network requests

      // get signed url api call - not to intercept
      cy.intercept("POST", "/api/trpc/user.getSignedUrlForUploadImage?**").as(
        "getSignedUrlApi",
      );

      // cloudlflare r2 upload through signed url - to intercept
      cy.intercept("PUT", "https://terrarossa.*.r2.cloudflarestorage.com/**", {
        statusCode: 200,
      }).as("uploadImageApi");

      // update image src api call - not to intercept
      cy.intercept("POST", "/api/trpc/user.updateImageSrc?**").as(
        "updateImageSrcApi",
      );

      // refetch user info api call - not to intercept
      cy.intercept("GET", "/api/trpc/user.getInfo?**").as("getUserInfoApi");

      // upload image (preventing actual upload to cloudflare)
      cy.getByDataTest("upload-image-button").click();
      cy.getByDataTest("upload-image-input").selectFile(
        "cypress/fixtures/media/mario_avatar.jpg",
        { force: true },
      );

      // check that network requests are sent
      cy.wait("@getSignedUrlApi");
      cy.wait("@uploadImageApi");
      cy.wait("@updateImageSrcApi");
      cy.wait("@getUserInfoApi");
    });
  });

  it("GIVEN a user with 2 reservations WHEN display profile page THEN reservations are shown in grid", function () {
    //given
    cy.addReservationToDB(
      dayjs().startOf("hour").toDate(),
      dayjs().startOf("hour").add(1, "hour").toDate(),
      this.clubIdForoItalico as string,
      pietrangeliCourtName,
      Cypress.env("USER1_MAIL") as string,
    );

    cy.addReservationToDB(
      dayjs().startOf("hour").add(2, "hour").toDate(),
      dayjs().startOf("hour").add(3, "hour").toDate(),
      this.clubIdForoItalico as string,
      centralCourtName,
      Cypress.env("USER1_MAIL") as string,
    );

    //when
    cy.reload();
    cy.getByDataTest("profile-page-initial-loading").should("not.exist");

    // then - check that reservations are shown in grid
    cy.getByDataTest("profile-reservations-grid").should("exist");
    cy.get(".MuiDataGrid-virtualScrollerRenderZone")
      .children()
      .should("have.length", 2);
  });
});
