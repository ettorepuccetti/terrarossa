export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserRole = UserRoles.ADMIN | UserRoles.USER;

export const defaultLogoSrc = "/mstile-144x144.png";

export const appNameInHeader = "Terrarossa";

export const reservationConstraints = {
  dayInThePastVisible: 2,
  daysInTheFutureVisible: 7,
  totalDaysVisible: 7 + 2
};

export const capitalise = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}