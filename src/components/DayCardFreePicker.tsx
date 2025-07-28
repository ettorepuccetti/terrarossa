import CalendarMonth from "@mui/icons-material/CalendarMonth";
import { Box, Dialog } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { type Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { useLogger } from "~/utils/logger";
import { dateIsInTimeRange, isAdminOfTheClub } from "~/utils/utils";
import DayCardLayout from "./DayCardLayout";

export default function DayCardFreePicker() {
  const { data: sessionData } = useSession();
  const clubData = useMergedStoreContext((store) => store.getClubData());
  const isAdmin = isAdminOfTheClub(sessionData, clubData.id);
  const customDateSelected = useMergedStoreContext(
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
  const logger = useLogger({
    component: "DayCardFreePickerDialog",
  });
  const clubData = useMergedStoreContext((store) => store.getClubData());
  const calendarRef = useMergedStoreContext((store) => store.calendarRef);
  const setSelectedDate = useMergedStoreContext(
    (store) => store.setSelectedDate,
  );
  const setCustomSelectedDate = useMergedStoreContext(
    (store) => store.setCustomDateSelected,
  );

  const onDateChanged = (date: Dayjs | null) => {
    if (date) {
      const dateIsOutsideRange = !dateIsInTimeRange(
        date,
        clubData.clubSettings.daysInThePastVisible,
        clubData.clubSettings.daysInFutureVisible,
      );
      logger.info("Date selected from free picker", {
        date: date.toDate(),
        dateIsOutsideRange: dateIsOutsideRange,
      });
      setSelectedDate(date);
      setCustomSelectedDate(dateIsOutsideRange);
      calendarRef.current?.getApi().gotoDate(date.toDate());
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} // to fix horizontal scrollbar on small screens
    >
      <StaticDatePicker onAccept={onDateChanged} />
    </Dialog>
  );
}
