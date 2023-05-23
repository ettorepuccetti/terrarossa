export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserRole = UserRoles.ADMIN | UserRoles.USER;