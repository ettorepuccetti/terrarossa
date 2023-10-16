import { Alert, Backdrop } from "@mui/material";
import { type TRPCClientErrorBase } from "@trpc/client";
import { type DefaultErrorShape } from "@trpc/server";

interface ErrorAlertProps<T extends DefaultErrorShape> {
  error: TRPCClientErrorBase<T> | null | undefined;
  onClose: () => void;
}

export default function ErrorAlert(props: ErrorAlertProps<DefaultErrorShape>) {
  return (
    <Backdrop
      open={props.error !== null}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Alert
        data-test="error-alert"
        severity="error"
        onClose={() => props.onClose()}
      >
        {props.error?.message}
      </Alert>
    </Backdrop>
  );
}
