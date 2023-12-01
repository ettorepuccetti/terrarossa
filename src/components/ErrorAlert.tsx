import { Alert, Backdrop } from "@mui/material";
import { type TRPCClientErrorBase } from "@trpc/client";
import { type DefaultErrorShape } from "@trpc/server";
import { useEffect } from "react";
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

  // to avoid logging the error twice
  useEffect(() => {
    if (error) {
      logger.error({ error: error.message }, "Error shown in ErrorAlert");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    error && (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Alert data-test="error-alert" severity="error" onClose={onClose}>
          {error?.message}
        </Alert>
      </Backdrop>
    )
  );
}
