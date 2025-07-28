import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  useTheme,
  type PaletteColor,
} from "@mui/material";
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
  const theme = useTheme();
  return (
    <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogLayout title="Legenda">
        <Box color="InfoText">
          <Box display={"flex"} flexDirection={"column"} gap={1}>
            <LegendaItem
              color={theme.palette.blue}
              text="Le mie prenotazioni"
            />
            <LegendaItem
              color={theme.palette.lightBlue}
              text="Prenotazioni di altri utenti"
            />
            <LegendaItem
              color={theme.palette.yellow}
              text="Prenotazioni eseguite dal circolo"
            />
            <LegendaItem color={theme.palette.orange} text="Ore fisse" />
          </Box>
        </Box>
      </DialogLayout>
    </Dialog>
  );
}

function LegendaItem({ color, text }: { color: PaletteColor; text: string }) {
  return (
    <Box display={"flex"} alignItems={"center"} gap={1}>
      <Box
        height={"20px"}
        width={"20px"}
        borderRadius={"15%"}
        bgcolor={color.main}
        border={1}
        borderColor={color.dark}
      />
      <Typography variant={"body1"}>{text}</Typography>
    </Box>
  );
}
