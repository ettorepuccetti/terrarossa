import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { itIT } from "@mui/x-date-pickers/locales";

declare module "@mui/material/styles" {
  interface Palette {
    lightBlue: Palette["primary"];
    yellow: Palette["primary"];
    orange: Palette["primary"];
    blue: Palette["primary"];
  }

  interface PaletteOptions {
    lightBlue?: PaletteOptions["primary"];
    yellow?: PaletteOptions["primary"];
    orange?: PaletteOptions["primary"];
    blue?: PaletteOptions["primary"];
  }
}

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

let lightTheme = createTheme(lightThemeOption, itIT);

lightTheme = createTheme(lightTheme, {
  palette: {
    lightBlue: lightTheme.palette.augmentColor({
      color: {
        main: "#c1d4fe",
      },
      name: "lightBlue",
    }),
    yellow: lightTheme.palette.augmentColor({
      color: {
        main: "#f7ed91",
      },
      name: "yellow",
    }),
    orange: lightTheme.palette.augmentColor({
      color: {
        main: "#ffd082",
      },
      name: "orange",
    }),
    blue: lightTheme.palette.augmentColor({
      color: {
        main: "#0071cc",
      },
      name: "blue",
    }),
  },
});

export default lightTheme;
