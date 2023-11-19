import { Box, DialogTitle, useTheme } from "@mui/material";

export default function DialogLayout({
  children,
  ...props
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Box sx={{ padding: ".75rem" }}>
      <DialogTitle textAlign={"center"}> {props.title} </DialogTitle>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1.5}
        alignItems={"center"}
        color={useTheme().palette.secondary.main}
      >
        {children}
      </Box>
    </Box>
  );
}
