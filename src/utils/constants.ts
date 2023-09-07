export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserRole = UserRoles.ADMIN | UserRoles.USER;

export const defaultLogoSrc = "/mstile-144x144.png";
export const defaultImg =
  "https://pub-f960339d8fe045c9a40b730d5aff9632.r2.dev/default-club.jpg";
export const appNameInHeader = "Terrarossa";

export const reservationConstraints = {
  hoursBeforeDeleting: 6,
};
