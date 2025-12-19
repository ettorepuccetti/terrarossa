import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import { IconButton } from "@mui/material";
import { type ReservationQueryType } from "~/hooks/calendarTrpcHooks";
import { useLogger } from "~/utils/logger";

type RefetchReservationButtonProps = {
  readonly reservationQuery: ReservationQueryType;
};

export default function RefetchReservationButton({
  reservationQuery,
}: RefetchReservationButtonProps) {
  const logger = useLogger({ component: "RefetchReservationButton" });

  return (
    <IconButton
      data-test="refetch-button"
      onClick={() => {
        logger.info("Refetching reservation manually", {});
        void reservationQuery.refetch();
      }}
    >
      <RefreshOutlined />
    </IconButton>
  );
}
