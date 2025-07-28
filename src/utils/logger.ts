import { useSession } from "next-auth/react";
import { env } from "~/env.mjs";

// create pino-logflare console stream for serverless functions and send function for browser logs
// Browser logs and serverless function logs are going to: https://logflare.app/sources/29358

// const LOGFLARE_SOURCE_ID_DEV = "8445833b-9fd1-47d8-b9b1-5948d7c88b42";

// const { stream, send } = logflarePinoVercel({
//   apiKey: env.NEXT_PUBLIC_LOGFLARE_API_KEY,
//   sourceToken:
//     env.NEXT_PUBLIC_APP_ENV === "production"
//       ? env.NEXT_PUBLIC_LOGFLARE_SOURCE_ID
//       : LOGFLARE_SOURCE_ID_DEV,
// });

// create pino logger
// export const loggerInternal = pino(
//   {
//     browser: {
//       transmit: {
//         level: "info",
//         send: send,
//       },
//     },
//     base: {
//       env: process.env.NODE_ENV,
//       vercelEnv: process.env.VERCEL_ENV,
//       revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
//     },
//   },
//   stream,
// );

export const loggerInternal = {
  child: ({}) => {
    return {
      debug: console.debug,
      info: console.log,
      error: console.error,
      warn: console.warn,
    };
  },
};

export const useLogger = (context: { [key: string]: string | undefined }) => {
  const { data: session } = useSession();
  if (env.NEXT_PUBLIC_APP_ENV === "test") {
    // return a void logger
    return {
      debug: console.debug,
      info: console.log,
      error: console.error,
      warn: console.warn,
    };
  } else {
    return loggerInternal.child({ ...context, userId: session?.user.id });
  }
};
