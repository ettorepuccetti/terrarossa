import { ClubSearchCard } from "~/components/ClubSearchCard";
import { club, clubAddress, mountWithContexts } from "./_constants";

describe("ClubSearchCard", () => {
  beforeEach(() => {
    cy.intercept("GET", "/_next/image?*", { fixture: "media/myteam.jpg,null" });
  });
  it("GIVEN club info WHEN render THEN show info correctly", () => {
    //given
    // when
    mountWithContexts(
      <ClubSearchCard club={{ ...club, Address: clubAddress }} />,
      null,
    );

    //then
    cy.getByDataTest("club-card-" + club.name).should(
      "contain.text",
      club.name,
    );
    cy.getByDataTest("address-info").should("contain.text", clubAddress.street);
    cy.getByDataTest("address-info").should("contain.text", clubAddress.number);
    cy.getByDataTest("address-info").should("contain.text", clubAddress.city);
    cy.getByDataTest("address-info").should(
      "contain.text",
      clubAddress.zipCode,
    );
    cy.getByDataTest("address-info").should(
      "contain.text",
      clubAddress.countryCode,
    );
  });
});
