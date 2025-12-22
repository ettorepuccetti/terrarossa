import {
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";

interface LandingSwitchProps {
  audience: "circoli" | "tennisti";
  setAudience: (audience: "circoli" | "tennisti") => void;
}

const LandingSwitch = ({ audience, setAudience }: LandingSwitchProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        pt: 2,
        pb: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <ToggleButtonGroup
          value={audience}
          exclusive
          onChange={(_e, v: "circoli" | "tennisti") => v && setAudience(v)}
          size="large"
          sx={{ background: "#f5f5f5", borderRadius: 2 }}
        >
          <ToggleButton value="tennisti" sx={{ fontWeight: 600, px: 4 }}>
            Per i Tennisti
          </ToggleButton>
          <ToggleButton value="circoli" sx={{ fontWeight: 600, px: 4 }}>
            Per i Circoli
          </ToggleButton>
        </ToggleButtonGroup>
      </Container>
    </Box>
  );
};

export default LandingSwitch;
