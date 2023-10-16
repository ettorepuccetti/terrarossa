import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import { IconButton } from "@mui/material";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";

export default function RefetchReservationButton() {
  const reservationQuery = useCalendarStoreContext(
    (store) => store.getReservationQuery,
  )();

  return (
    <IconButton
      data-test="refetch-button"
      onClick={() => {
        void reservationQuery.refetch();
      }}
    >
      <RefreshOutlined />
    </IconButton>
  );
}
