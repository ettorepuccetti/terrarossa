import { Box, Container, Grid, Typography } from "@mui/material";

const TennistiTeam = () => (
  <Box sx={{ bgcolor: "#f8f9fa", py: 8 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Un team di esperti per i tennisti
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src="/team/dev1.png"
              alt="Dev 1"
              style={{
                borderRadius: "50%",
                width: 96,
                height: 96,
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
            <Typography fontWeight={700}>Giulia R.</Typography>
            <Typography variant="body2" color="text.secondary">
              Lead Developer
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src="/team/dev2.png"
              alt="Dev 2"
              style={{
                borderRadius: "50%",
                width: 96,
                height: 96,
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
            <Typography fontWeight={700}>Luca M.</Typography>
            <Typography variant="body2" color="text.secondary">
              Product Designer
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src="/team/dev3.png"
              alt="Dev 3"
              style={{
                borderRadius: "50%",
                width: 96,
                height: 96,
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
            <Typography fontWeight={700}>Sara T.</Typography>
            <Typography variant="body2" color="text.secondary">
              Customer Success
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src="/team/dev4.png"
              alt="Dev 4"
              style={{
                borderRadius: "50%",
                width: 96,
                height: 96,
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
            <Typography fontWeight={700}>Marco F.</Typography>
            <Typography variant="body2" color="text.secondary">
              Backend Architect
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default TennistiTeam;
