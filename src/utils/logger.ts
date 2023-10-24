import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";
import { env } from "~/env.mjs";

// create pino-logflare console stream for serverless functions and send function for browser logs
// Browser logs are going to: https://logflare.app/sources/13989
// Vercel log drain was setup to send logs here: https://logflare.app/sources/13830

const { stream, send } = logflarePinoVercel({
  apiKey: env.NEXT_PUBLIC_LOGFLARE_API_KEY,
  sourceToken: env.NEXT_PUBLIC_LOGFLARE_SOURCE_ID,
});

// create pino logger
const loggerInternal = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send: send,
      },
    },
    level: "debug",
    base: {
      env: process.env.VERCEL_ENV || process.env.NODE_ENV,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream,
);

export const loggerBuilder = (logkey: string) => {
  type logActionParams = {
    message: string;
    objectToLog: unknown;
  };

  const buildLogLine = ({ message, objectToLog }: logActionParams) => {
    return JSON.stringify({
      LOGKEY: logkey,
      MESSAGE: message,
      PAYLOAD: objectToLog,
    });
  };

  return {
    info(message: string, objectToLog: unknown) {
      loggerInternal.info(objectToLog, buildLogLine({ message, objectToLog }));
    },
    warn(message: string, objectToLog: unknown) {
      loggerInternal.warn(objectToLog, buildLogLine({ message, objectToLog }));
    },
    error(message: string, objectToLog: unknown) {
      loggerInternal.error(objectToLog, buildLogLine({ message, objectToLog }));
    },
  };
};
