import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { CacheProvider, type EmotionCache } from "@emotion/react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import createEmotionCache from '../utils/createEmotionCache';
import lightThemeOptions from '../styles/lightThemeOptions';


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

interface MyAppType {
  session: Session | null,
  emotionCache?: EmotionCache;
}


const MyApp: AppType<MyAppType> = ({
  Component,
  pageProps: { session, emotionCache = clientSideEmotionCache, ...pageProps },
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <SessionProvider session={session}>
          <CssBaseline />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default api.withTRPC(MyApp);
