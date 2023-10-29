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
    <div style={{ position: "relative" }}>
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
    </div>
  );
};

export default SpinnerPartial;
