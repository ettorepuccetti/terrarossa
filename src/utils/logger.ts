import { useSession } from "next-auth/react";

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
  child: ({
    context,
    userId,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: Record<string, string | undefined>;
    userId: string | undefined;
  }) => {
    return {
      debug: (message?: string, optionalParams?: object) =>
        console.debug(message, { userId, ...context, ...optionalParams }),

      info: (message?: string, optionalParams?: object) =>
        console.log(message, { userId, ...context, ...optionalParams }),

      warn: (message?: string, optionalParams?: object) =>
        console.warn(message, { userId, ...context, ...optionalParams }),

      error: (message?: string, optionalParams?: object) =>
        console.error(message, { userId, ...context, ...optionalParams }),
    };
  },
};

export const useLogger = (context: { [key: string]: string | undefined }) => {
  const { data: session } = useSession();
  return loggerInternal.child({ userId: session?.user.id, context });
};
