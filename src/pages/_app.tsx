import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import { CacheProvider, type EmotionCache } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "~/styles/globals.css";

import lightTheme from "../styles/lightTheme";
import createEmotionCache from "../utils/createEmotionCache";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  session: Session | null;
  emotionCache: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    session,
    emotionCache = clientSideEmotionCache,
    ...pageProps
  } = props;
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
