import { Alert, Snackbar } from "@mui/material";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";

export const ReserveSuccessSnackbar = () => {
  const open = useMergedStoreContext((store) => store.openReserveSuccess);
  const setOpen = useMergedStoreContext((store) => store.setOpenReserveSuccess);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      data-test={"reserve-success-snackbar"}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
    >
      <Alert
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        Prenotazione avvenuta con successo!
      </Alert>
    </Snackbar>
  );
};
