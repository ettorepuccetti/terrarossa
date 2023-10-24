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

/**
 * Wrap the pino logger to add a logkey to the log message and to write the payload in the log message
 * @param logkey to prefix the log message with
 * @returns a logger object that wraps the pino logger methods info, warn, error
 */
export const loggerBuilder = (logkey: string) => {
  /**
   * Write the payload in the log message (to allow better filtering in logflare)
   * @param message original message
   * @param objectToLog payload
   * @returns log message with payload written in it
   */
  const buildLogLine = (message: string, objectToLog: unknown) => {
    return JSON.stringify({
      LOGKEY: logkey,
      MESSAGE: message,
      PAYLOAD: objectToLog,
    });
  };

  return {
    info(message: string, objectToLog: unknown) {
      loggerInternal.info(objectToLog, buildLogLine(message, objectToLog));
    },
    warn(message: string, objectToLog: unknown) {
      loggerInternal.warn(objectToLog, buildLogLine(message, objectToLog));
    },
    error(message: string, objectToLog: unknown) {
      loggerInternal.error(objectToLog, buildLogLine(message, objectToLog));
    },
  };
};
