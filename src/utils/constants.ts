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
  minTimeHours: 8,
  minTimeMinutes: 0,
  maxTimeHours: 22,
  maxTimeMinutes: 0,
  getSlotMinTime: () => {
    return `${reservationConstraints.minTimeHours
      .toString()
      .padStart(2, "0")}:${reservationConstraints.minTimeMinutes
      .toString()
      .padStart(2, "0")}`;
  },
  /**
   * calculate the closing time of the club, from the `maxTimeHours` + 1 and `maxTimeMinutes` constants
   * @returns the closing time of the club (not even show in calendar) in the format HH:MM
   * @example 22:00
   */
  getSlotMaxTime: () => {
    return `${(reservationConstraints.maxTimeHours + 1)
      .toString()
      .padStart(2, "0")}:${reservationConstraints.maxTimeMinutes
      .toString()
      .padStart(2, "0")}`;
  },
  getMaxReservationHour: () => {
    return reservationConstraints.maxTimeHours;
  },
  getMaxReservationMinutes: () => {
    return reservationConstraints.maxTimeMinutes;
  },
  getMinReservationHour: () => {
    return reservationConstraints.minTimeHours;
  },
  getMinReservationMinutes: () => {
    return reservationConstraints.minTimeMinutes;
  },
};
