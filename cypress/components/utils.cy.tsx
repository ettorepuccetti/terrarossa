import dayjs from "dayjs";
import { dateIsInTimeRange } from "~/utils/utils";

describe("dateIsInTimeRange", () => {
  const daysInFutureVisible = 7;
  const daysInThePastVisible = 2;
  it("GIVEN date inside time range WHEN check THEN true", () => {
    //given
    const dateToCheck = dayjs().startOf("day");
    //when
    const result = dateIsInTimeRange(
      dateToCheck,
      daysInThePastVisible,
      daysInFutureVisible,
    );
    //then
    expect(result).equal(true);
  });

  it("GIVEN date as first day in range WHEN check THEN true", () => {
    //given
    const dateToCheck = dayjs()
      .subtract(daysInThePastVisible, "day")
      .startOf("day");
    //when
    const result = dateIsInTimeRange(
      dateToCheck,
      daysInThePastVisible,
      daysInFutureVisible,
    );
    //then
    expect(result).equal(true);
  });

  it("GIVEN date as last day in range WHEN check THEN true", () => {
    //given
    const dateToCheck = dayjs().add(daysInFutureVisible, "day").startOf("day");
    //when
    const result = dateIsInTimeRange(
      dateToCheck,
      daysInThePastVisible,
      daysInFutureVisible,
    );
    //then
    expect(result).equal(true);
  });

  it("GIVEN date as one day before first day in range WHEN check THEN false", () => {
    //given
    const dateToCheck = dayjs()
      .subtract(daysInThePastVisible + 1, "day")
      .startOf("day");
    //when
    const result = dateIsInTimeRange(
      dateToCheck,
      daysInThePastVisible,
      daysInFutureVisible,
    );
    //then
    expect(result).equal(false);
  });

  it("GIVEN date as one day after last day in range WHEN check THEN false", () => {
    //given
    const dateToCheck = dayjs()
      .add(daysInFutureVisible + 1, "day")
      .startOf("day");
    //when
    const result = dateIsInTimeRange(
      dateToCheck,
      daysInThePastVisible,
      daysInFutureVisible,
    );
    //then
    expect(result).equal(false);
  });
});
