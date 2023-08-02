import { Backdrop, CircularProgress } from "@mui/material";

export default function Spinner(props: { isLoading: boolean }) {
  return (
    <Backdrop
      open={props.isLoading}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
