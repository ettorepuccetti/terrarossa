import { Box } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

const SpinnerPartial = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Box position={"relative"} maxWidth={"100%"}>
      <Backdrop
        sx={{
          color: "#FFFFFF",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: "absolute",
        }}
        open={open}
      >
        <CircularProgress color="inherit" data-test="spinner" />
      </Backdrop>
      {children}
    </Box>
  );
};

export default SpinnerPartial;
