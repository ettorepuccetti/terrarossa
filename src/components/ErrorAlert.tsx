import { Alert, Backdrop } from "@mui/material";
import { type TRPCClientErrorBase } from "@trpc/client";
import { type DefaultErrorShape } from "@trpc/server";

interface ErrorAlertProps<T extends DefaultErrorShape> {
  error: TRPCClientErrorBase<T> | null;
  onClose: () => void;
}

export default function ErrorAlert({
  error,
  onClose,
}: ErrorAlertProps<DefaultErrorShape>) {
  return (
    error && (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Alert
          data-test="error-alert"
          severity="error"
          onClose={() => onClose()}
        >
          {error?.message}
        </Alert>
      </Backdrop>
    )
  );
}
