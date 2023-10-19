import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { itIT } from "@mui/x-date-pickers/locales";

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

const lightTheme = createTheme(lightThemeOption, itIT);

export default lightTheme;
