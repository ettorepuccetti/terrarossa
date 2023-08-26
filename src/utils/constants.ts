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
  daysInThePastVisible: 2,
  daysInTheFutureVisible: 7,
  hoursBeforeDeleting: 6,
  firstBookableHour: 8,
  firstBookableMinute: 0,
  lastBookableHour: 22,
  lastBookableMinute: 0,
  maxActiveReservationsPerUser: 4,

  /**
   * Calculate the opening time of the club, from the `firstBookableHour` and `firstBookableMinute` constants
   * @returns the opening time of the club (first available slot) in the format HH:MM
   * @example 08:00
   */
  getClubOpeningTime: (): string => {
    return `${reservationConstraints.firstBookableHour
      .toString()
      .padStart(2, "0")}:${reservationConstraints.firstBookableMinute
      .toString()
      .padStart(2, "0")}`;
  },
  /**
   * Calculate the closing time of the club, from the `lastBookableHour` + 1 and `lastBookableMinute` constants
   * @returns the closing time of the club (not even show in calendar) in the format HH:MM
   * @example 22:00
   */
  getClubClosingTime: (): string => {
    return `${(reservationConstraints.lastBookableHour + 1)
      .toString()
      .padStart(2, "0")}:${reservationConstraints.lastBookableMinute
      .toString()
      .padStart(2, "0")}`;
  },
  getLastBookableHour: () => {
    return reservationConstraints.lastBookableHour;
  },
  getLastBookableMinute: () => {
    return reservationConstraints.lastBookableMinute;
  },
  getFirstBookableHour: () => {
    return reservationConstraints.firstBookableHour;
  },
  getFirstBookableMinute: () => {
    return reservationConstraints.firstBookableMinute;
  },
};
