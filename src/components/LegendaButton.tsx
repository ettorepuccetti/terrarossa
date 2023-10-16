import InfoIcon from "@mui/icons-material/Info";
import { Alert, Box, Dialog, IconButton } from "@mui/material";
import { useState } from "react";
import DialogLayout from "./DialogLayout";
export default function LegendaButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <IconButton data-test="legenda-button" onClick={() => setShowModal(true)}>
        <InfoIcon />
      </IconButton>

      <LegendaDialog showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

function LegendaDialog({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  return (
    <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogLayout title="Legenda">
        <Box color="InfoText">
          <Alert variant="outlined" severity="warning">
            In costruzione
          </Alert>
        </Box>
      </DialogLayout>
    </Dialog>
  );
}
