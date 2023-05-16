import { Box, DialogTitle } from "@mui/material";

export default function DialogLayout({ children, ...props }: { children: React.ReactNode, title: string }) {
  return (
    <Box sx={{ padding: '1rem' }}>
      <DialogTitle textAlign={'center'}> {props.title} </DialogTitle>
      <Box display={"flex"} flexDirection={"column"} gap={1.5}>
        {children}
      </Box>
    </Box>
  )
}