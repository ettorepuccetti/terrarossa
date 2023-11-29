import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import { IconButton } from "@mui/material";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import { useLogger } from "~/utils/logger";

export default function RefetchReservationButton() {
  const logger = useLogger({ component: "RefetchReservationButton" });
  const reservationQuery = useMergedStoreContext(
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
