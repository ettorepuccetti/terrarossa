import { type ClubSettings } from "@prisma/client";
import { UserRoles } from "~/utils/constants";

export const session = {
  expires: "2022-10-20T11:00:00.000Z",
  user: {
    id: "test",
    name: "test",
    email: "",
    role: UserRoles.USER,
  },
};

export const clubSettings: ClubSettings = {
  id: "1",
  description: null,
  daysInThePastVisible: 2,
  daysInFutureVisible: 7,
  firstBookableHour: 8,
  firstBookableMinute: 0,
  lastBookableHour: 22,
  lastBookableMinute: 0,
  hoursBeforeCancel: 4,
  maxReservationPerUser: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
};
