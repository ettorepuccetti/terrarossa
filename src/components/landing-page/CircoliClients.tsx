import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";

const CircoliClients = () => (
  <Box sx={{ py: 8, bgcolor: "#fff" }}>
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Alcuni dei nostri clienti
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Image
          src="/partners/partner1.png"
          alt="Partner 1"
          width={120}
          height={48}
        />
        <Image
          src="/partners/partner2.png"
          alt="Partner 2"
          width={120}
          height={48}
        />
        <Image
          src="/partners/partner3.png"
          alt="Partner 3"
          width={120}
          height={48}
        />
        <Image
          src="/partners/partner4.png"
          alt="Partner 4"
          width={120}
          height={48}
        />
        <Image
          src="/partners/partner5.png"
          alt="Partner 5"
          width={120}
          height={48}
        />
      </Box>
    </Container>
  </Box>
);

export default CircoliClients;
