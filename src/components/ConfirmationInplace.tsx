import { Alert, Box, Button } from "@mui/material";

interface ConfirmationProps {
  open: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmationInplace(props: ConfirmationProps) {
  const { open, message } = props;

  if (!open) return null;

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Alert severity="error">{message}</Alert>
      <Box marginTop={2} display={"flex"} justifyContent={"space-evenly"}>
        <Button
          data-test="cancel-button"
          onClick={() => props.onCancel()}
          color="info"
        >
          Annulla
        </Button>
        <Button
          data-test="confirm-button"
          onClick={() => props.onConfirm()}
          color="error"
        >
          Conferma
        </Button>
      </Box>
    </Box>
  );
}
