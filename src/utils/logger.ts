import { useSession } from "next-auth/react";
import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";
import { env } from "~/env.mjs";

// create pino-logflare console stream for serverless functions and send function for browser logs
// Browser logs and serverless function logs are going to: https://logflare.app/sources/29358

const { stream, send } = logflarePinoVercel({
  apiKey: env.NEXT_PUBLIC_LOGFLARE_API_KEY,
  sourceToken: env.NEXT_PUBLIC_LOGFLARE_SOURCE_ID,
});

// create pino logger
export const loggerInternal = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send: send,
      },
    },
    base: {
      env: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream,
);

export const useLogger = (context: { [key: string]: string | undefined }) => {
  const { data: session } = useSession();
  if (env.NEXT_PUBLIC_APP_ENV === "test") {
    // return a void logger
    return {
      debug: () => {},
      info: () => {},
      error: () => {},
      warn: () => {},
    };
  } else {
    return loggerInternal.child({ ...context, userId: session?.user.id });
  }
};