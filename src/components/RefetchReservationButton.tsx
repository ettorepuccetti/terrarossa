import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import { IconButton } from "@mui/material";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { getLogger } from "~/utils/logger";

export default function RefetchReservationButton() {
  const logger = getLogger({ component: "RefetchReservationButton" });
  const reservationQuery = useCalendarStoreContext(
    (store) => store.getReservationQuery,
  )();

  return (
    <IconButton
      data-test="refetch-button"
      onClick={() => {
        logger.info(null, "Refetching reservation manually");
        void reservationQuery.refetch();
      }}
    >
      <RefreshOutlined />
    </IconButton>
  );
}
