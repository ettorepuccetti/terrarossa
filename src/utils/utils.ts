import dayjs from "dayjs";
import { type Session } from "next-auth";
import { UserRoles } from "./constants";

export const capitaliseFirstChar = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Check if the logged user is admin of the club
 * @param sessionData session of the logged user
 * @param clubId id of the club to check
 * @returns true if the user is logged and is admin of the club, false otherwise
 */
export function isAdminOfTheClub(
  sessionData: Session | null | undefined,
  clubId: string | undefined
): boolean {
  return (
    sessionData !== undefined &&
    sessionData !== null &&
    clubId !== undefined &&
    sessionData.user.role === UserRoles.ADMIN &&
    sessionData.user.clubId === clubId
  );
}

/**
 * Check if a given slot starting at `selectedStartDate` is selectable.
 * A slot is selectable if it is not the last one, because the last one cannot fit the minimum duration of a reservation
 * @param selectedStartDate startDate of the selected slot
 * @param clubClosingHour closing hour of the club
 * @param clubClosingMinutes closing minutes of the club
 * @returns `true` if the slot is not the last one, `false` if instead is the last clickable slot that cannot fit the minimum duration of a reservation
 */
export function isSelectableSlot(
  selectedStartDate: Date,
  clubClosingHour: number,
  clubClosingMinutes: number
): boolean {
  return dayjs()
    .set("hours", selectedStartDate.getHours())
    .set("minutes", selectedStartDate.getMinutes())
    .isBefore(
      //last bookable hour
      dayjs().set("hours", clubClosingHour).set("minutes", clubClosingMinutes)
    );
}
