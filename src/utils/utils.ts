import dayjs, { type Dayjs } from "dayjs";
import { type Session } from "next-auth";
import { UserRoles } from "./constants";

export const capitaliseFirstChar = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Format a time string in the format `HH:MM` given the hour and minute as numbers.
 * By default, it pads the hour with a given number of digits
 * @param hour
 * @param minute
 * @param paddingHour whether to pad the hour with a leading 0, if it has only one digit
 * @returns a time in the format `HH:MM` (or `H:MM`, if paddingHour is false)
 * @example formatTimeString(9, 30) // returns "09:30"
 * formatTimeString(9, 30, false) // returns "9:30"
 */
export function formatTimeString(
  hour: number,
  minute: number,
  paddingHour: boolean = true,
): string {
  return (
    hour.toString().padStart(paddingHour ? 2 : 0, "0") +
    ":" +
    minute.toString().padStart(2, "0")
  );
}

/**
 * Check if the logged user is admin of the club
 * @param sessionData session of the logged user
 * @param clubId id of the club to check
 * @returns true if the user is logged and is admin of the club, false otherwise
 */
export function isAdminOfTheClub(
  sessionData: Session | null | undefined,
  clubId: string,
): boolean {
  return (
    !!sessionData &&
    sessionData.user.role === UserRoles.ADMIN &&
    sessionData.user.clubId === clubId
  );
}

/**
 * Check if a given slot starting at `selectedStartDate` is selectable.
 * A slot (of 30 min) is selectable if it is not the last one, because the last one cannot fit the minimum duration of a reservation
 * @param selectedStartDate startDate of the selected slot
 * @param lastBookableHour closing hour of the club
 * @param lastBookableMinute closing minutes of the club
 * @returns `true` if the slot is not the last one, `false` if instead is the last clickable slot that cannot fit the minimum duration of a reservation
 */
export function isSelectableSlot(
  selectedStartDate: Date,
  lastBookableHour: number,
  lastBookableMinute: number,
): boolean {
  const fixedDate = dayjs();
  // check if !(selectedStartDate > lastBookableHour)
  return !(
    //selected start date
    fixedDate
      .set("hours", selectedStartDate.getHours())
      .set("minutes", selectedStartDate.getMinutes())
      .isAfter(
        //last bookable hour
        fixedDate
          .set("hours", lastBookableHour)
          .set("minutes", lastBookableMinute),
      )
  );
}

/**
 * Check if the given date is in the time range determined by
 * the given number of days in the past and in the future with respect to the current date
 * @param date  date to check
 * @param daysInThePastVisible days in the past of the time range
 * @param daysInFutureVisible days in the future of the time range
 * @returns `true` if the given date is in the time range, `false` otherwise
 */
export function dateIsInTimeRange(
  date: Dayjs,
  daysInThePastVisible: number,
  daysInFutureVisible: number,
) {
  const today = dayjs().startOf("day");
  const firstDayInRange = today.subtract(daysInThePastVisible, "day");
  const lastDayInRange = today.add(daysInFutureVisible, "day");

  //check if (date >= firstDayInRange && date <= lastDayInRange)
  return (
    (date.isAfter(firstDayInRange) || date.isSame(firstDayInRange)) &&
    (date.isBefore(lastDayInRange) || date.isSame(lastDayInRange))
  );
}

/**
 * Check that the selected time slot is bookable for the given user. If the user is admin, is always bookable.
 * If the user is non admin, startDate must be in the future.
 * @param sessionData object containing the session data of the logged user
 * @param clubId
 * @param startDate
 * @returns true if the user is admin of the club or if the start date is in the future, false otherwise
 */
export const startDateIsFuture = (
  sessionData: Session | null,
  clubId: string,
  startDate: Dayjs,
) => {
  return isAdminOfTheClub(sessionData, clubId) || startDate.isAfter(dayjs());
};
