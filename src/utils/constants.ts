export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserRole = UserRoles.ADMIN | UserRoles.USER;

export const defaultLogoSrc = "/mstile-144x144.png";
export const defaultImg =
  "https://pub-f960339d8fe045c9a40b730d5aff9632.r2.dev/default-club.jpg";
export const appNameInHeader = "Terrarossa";

// -------------------------
// --- CYPRESS E2E TESTS ---
// -------------------------
export const foroItalicoName = "Foro Italico";
export const centralCourtName = "Centrale";
export const pietrangeliCourtName = "Pietrangeli";
export const court1Name = "Campo 1";

export const allEnglandClubName = "All England Club";
export const centerCourtName = "Center Court";
export const court2Name = "Court 2";
