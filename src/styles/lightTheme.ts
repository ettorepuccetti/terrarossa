import { createTheme, type ThemeOptions } from "@mui/material/styles";

const lightThemeOption: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#C23B22",
    },
    secondary: {
      main: "#1976d2",
    },
  },
};

const lightTheme = createTheme(lightThemeOption);

export default lightTheme;
