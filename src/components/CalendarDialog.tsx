import { Dialog } from "@mui/material";
import DialogLayout from "./DialogLayout";

export default function CalendarDialog({
  children,
  ...props
}: {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
  dataTest?: string;
}) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      data-test={props.dataTest}
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: "350px",
        },
      }}
    >
      <DialogLayout title={props.title}>{children}</DialogLayout>
    </Dialog>
  );
}
