import { Box } from "@mui/material";

export default function DayCardLayout({
  children,
  showDot,
}: {
  children: React.ReactNode;
  showDot?: boolean;
}) {
  return (
    <Box
      data-test="day-card"
      sx={{
        display: "flex",
        flexDirection: "column",
        borderTop: 0,
        borderRadius: 3,
        cursor: "pointer",
      }}
    >
      {/* Card container defining dimension */}
      <Box
        display={"flex"}
        width={50}
        height={50}
        borderRadius={3}
        sx={{ boxShadow: 2 }}
      >
        {children}
      </Box>
      {/* dot indicating the selected date */}
      {showDot && (
        <Box
          data-test="dot-day-card"
          sx={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: showDot ? "#F1564E" : "transparent",
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 1,
            marginBottom: 1, //for the scroll bar
            boxShadow: showDot ? 3 : 0,
          }}
        />
      )}
    </Box>
  );
}
