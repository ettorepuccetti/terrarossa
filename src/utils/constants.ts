import { type Address, type PhoneNumber } from "@prisma/client";

export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserRole = UserRoles.ADMIN | UserRoles.USER;

export const defaultLogoSrc = "/mstile-144x144.png";
export const defaultClubImage =
  process.env.NEXT_PUBLIC_R2_BUCKET_URL + "default-club.jpg";
export const appNameInHeader = "Terrarossa";

// -------------------------
// --- CYPRESS E2E TESTS ---
// -------------------------
export const foroItalicoName = "Foro Italico";
export const centralCourtName = "Centrale";
export const pietrangeliCourtName = "Pietrangeli";
export const court1ForoName = "Court 1";

export const allEnglandClubName = "All England Club";
export const centerCourtName = "Center Court";
export const court1AllEngName = "Court 1";

/* --------------------
---- CLUBS SEEDING ----
----------------------- */
type AddressInput = Omit<Address, "id" | "createdAt" | "updatedAt" | "clubId">;

type PhoneNumberInput = Pick<PhoneNumber, "number" | "nationalPrefix">;

export const foroItalicoAddress: AddressInput = {
  street: "Viale del Foro Italico",
  number: "1",
  zipCode: "00135",
  city: "Roma",
  country: "Italy",
  countryCode: "IT",
};

export const allEnglandAddress: AddressInput = {
  street: "Church Rd",
  zipCode: "SW19 5AE",
  city: "London",
  country: "United Kingdom",
  countryCode: "GB",
  number: null,
};

export const foroItalicoPhone: PhoneNumberInput = {
  number: "0636851",
  nationalPrefix: "+39",
};

export const allEnglandPhone: PhoneNumberInput = {
  number: "02089441066",
  nationalPrefix: "+44",
};
