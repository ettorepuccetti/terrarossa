import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { MergedStoreProvider } from "~/hooks/useCalendarStoreContext";

import { api, getBaseUrl } from "~/utils/api";

import { CacheProvider, type EmotionCache } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "~/styles/globals.css";

import lightTheme from "../styles/lightTheme";
import createEmotionCache from "../utils/createEmotionCache";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  session: Session | null;
  emotionCache: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  const {
    Component,
    session,
    emotionCache = clientSideEmotionCache,
    ...pageProps
  } = props;
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={lightTheme}>
            <SessionProvider session={session}>
              <MergedStoreProvider>
                <CssBaseline />
                <ReactQueryDevtools initialIsOpen={false} />
                <Component {...pageProps} />
              </MergedStoreProvider>
            </SessionProvider>
          </ThemeProvider>
        </CacheProvider>
      </QueryClientProvider>
    </api.Provider>
  );
};

export default MyApp;
