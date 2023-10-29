import CalendarMonth from "@mui/icons-material/CalendarMonth";
import { Box, Dialog } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { type Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { dateIsInTimeRange, isAdminOfTheClub } from "~/utils/utils";
import DayCardLayout from "./DayCardLayout";
import { getLogger } from "~/utils/logger";

export default function DayCardFreePicker() {
  const { data: sessionData } = useSession();
  const clubData = useCalendarStoreContext((store) => store.getClubData());
  const isAdmin = isAdminOfTheClub(sessionData, clubData.id);
  const customDateSelected = useCalendarStoreContext(
    (store) => store.customDateSelected,
  );
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {isAdmin && (
        <DayCardLayout showDot={customDateSelected}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexGrow={1}
            sx={{
              backgroundColor: "lightgrey",
              borderRadius: "inherit",
              border: ".5px solid grey",
            }}
            onClick={() => setShowDialog(true)}
          >
            <CalendarMonth />
          </Box>
        </DayCardLayout>
      )}

      {showDialog && (
        <DayCardFreePickerDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
}

function DayCardFreePickerDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const logger = getLogger({ component: "DayCardFreePickerDialog" });
  const clubData = useCalendarStoreContext((store) => store.getClubData());
  const calendarRef = useCalendarStoreContext((store) => store.calendarRef);
  const setSelectedDate = useCalendarStoreContext(
    (store) => store.setSelectedDate,
  );
  const setCustomSelectedDate = useCalendarStoreContext(
    (store) => store.setCustomDateSelected,
  );

  const onDateChanged = (date: Dayjs | null) => {
    if (date) {
      const dateIsOutsideRange = !dateIsInTimeRange(
        date,
        clubData.clubSettings.daysInThePastVisible,
        clubData.clubSettings.daysInFutureVisible,
      );
      logger.info(
        { date: date.toDate(), dateIsOutsideRange: dateIsOutsideRange },
        "Date selected from free picker",
      );
      setSelectedDate(date);
      setCustomSelectedDate(dateIsOutsideRange);
      calendarRef.current?.getApi().gotoDate(date.toDate());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box display={"flex"} flexDirection={"column"}>
        <StaticDatePicker onAccept={onDateChanged} />
      </Box>
    </Dialog>
  );
}
