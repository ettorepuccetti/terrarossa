import dayjs from "dayjs";
import { ProfileTextInfo } from "~/components/ProfileTextInfo";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { type User } from "../../src/generated/prisma/client";
import {
  buildTrpcMutationMock,
  user as defaultUser,
  mountWithContexts,
  session,
} from "./_constants";

function ProfileTextInfoWrapper({ user }: { user: User }) {
  // set userData
  useMergedStoreContext((store) => store.setUserData)(user);

  // set mutations mocks
  const updateUsernameAlias: string = "setUpdateUsername";
  useMergedStoreContext((store) => store.setUpdateUsername)(
    buildTrpcMutationMock(updateUsernameAlias),
  );

  return <ProfileTextInfo />;
}

function mountComponent(user: User) {
  mountWithContexts(<ProfileTextInfoWrapper user={user} />, session);
}

describe("ProfileTextInfo", () => {
  it("GIVEN basic user info WHEN render THEN show info correctly", () => {
    const testUsername = "Marione";
    const testEmail = "marione@personal.it";
    const testCreatedAt: Date = new Date("2021-10-10T10:10:10.000Z");
    //given
    const user: User = {
      ...defaultUser,
      name: testUsername,
      email: testEmail,
      createdAt: testCreatedAt,
    };

    //when
    mountComponent(user);

    //then
    cy.getByDataTest("username").should("have.value", testUsername);
    cy.getByDataTest("email").should("have.value", testEmail);
    cy.getByDataTest("created-at").should(
      "have.value",
      dayjs(testCreatedAt).format("DD/MM/YYYY"),
    );
  });

  it("GIVEN user info WHEN edit username THEN new username is sent to server", () => {
    //given
    mountComponent(defaultUser);

    //when
    cy.getByDataTest("edit-username-button").click();
    cy.getByDataTest("edit-username-dialog").should("be.visible");
    cy.getByDataTest("edit-username-input").type("newusername");
    cy.get(".MuiFormHelperText-root").should("not.exist");
    cy.getByDataTest("submit-username").click();

    //then
    cy.get("@setUpdateUsername").should("be.calledOnce");
    cy.get("@setUpdateUsername").should("be.be.calledWith", {
      newUsername: "newusername",
    });
  });

  it("GIVEN user info WHEN edit username and cancel THEN new username is not sent to server", () => {
    //given
    mountComponent(defaultUser);

    //when
    cy.getByDataTest("edit-username-button").click();
    cy.getByDataTest("edit-username-dialog").should("be.visible");
    cy.getByDataTest("edit-username-input")
      .type("will be discarded")
      .type("{esc}");

    //then
    cy.get("@setUpdateUsername").should("not.be.called");
  });

  it("GIVEN user info WHEN enter empty username THEN submit button is disabled", () => {
    //given
    mountComponent(defaultUser);

    //when
    cy.getByDataTest("edit-username-button").click();
    cy.getByDataTest("edit-username-dialog").should("be.visible");
    cy.getByDataTest("edit-username-input").clear();

    //then
    cy.getByDataTest("submit-username").should("be.disabled");
    cy.get(".MuiFormHelperText-root")
      .should("be.visible")
      .and("have.text", "Minimo 4 caratteri");
  });

  it("GIVEN edited username in dialog WHEN close the dialog and opened again THEN original username is still shown", () => {
    //given
    mountComponent(defaultUser);
    cy.getByDataTest("edit-username-button").click();
    cy.getByDataTest("edit-username-input").type("EditedUsername");

    //when
    cy.getByDataTest("edit-username-dialog").click("topRight");
    cy.getByDataTest("edit-username-button").click();

    //then
    cy.getByDataTest("edit-username-input").should(
      "have.value",
      defaultUser.name,
    );
  });
});
