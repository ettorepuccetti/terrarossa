import { Box, Container, Typography } from "@mui/material";

const TennistiClients = () => (
  <Box sx={{ py: 6, bgcolor: "#fff" }}>
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Giocano con noi
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <img src="/partners/partner1.png" alt="Partner 1" height={40} />
        <img src="/partners/partner2.png" alt="Partner 2" height={40} />
        <img src="/partners/partner3.png" alt="Partner 3" height={40} />
        <img src="/partners/partner4.png" alt="Partner 4" height={40} />
        <img src="/partners/partner5.png" alt="Partner 5" height={40} />
      </Box>
    </Container>
  </Box>
);

export default TennistiClients;
