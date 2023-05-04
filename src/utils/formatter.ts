export function extractTimeFromDate(date: Date | undefined | null) {
  return date?.toTimeString().split(":").splice(0, 2).join(":")
}