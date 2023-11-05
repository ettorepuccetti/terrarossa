import { Alert, Backdrop } from "@mui/material";
import { type TRPCClientErrorBase } from "@trpc/client";
import { type DefaultErrorShape } from "@trpc/server";
import { useLogger } from "~/utils/logger";

interface ErrorAlertProps<T extends DefaultErrorShape> {
  error: TRPCClientErrorBase<T> | null;
  onClose: () => void;
}

export default function ErrorAlert({
  error,
  onClose,
}: ErrorAlertProps<DefaultErrorShape>) {
  const logger = useLogger({
    component: "ErrorAlert",
  });
  if (error) {
    logger.error({ error: error.message }, "Error shown in ErrorAlert");
  }
  return (
    error && (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Alert
          data-test="error-alert"
          severity="error"
          onClose={() => {
            onClose();
          }}
        >
          {error?.message}
        </Alert>
      </Backdrop>
    )
  );
}
