import { type Session } from "next-auth";
import { UserRoles } from "./constants";

export const capitalise = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

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
