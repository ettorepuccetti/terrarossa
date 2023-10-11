import { CacheProvider, ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { type Club, type ClubSettings, type Court } from "@prisma/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import superjson from "superjson";
import lightTheme from "~/styles/lightTheme";
import { api, getBaseUrl } from "~/utils/api";
import { UserRoles } from "~/utils/constants";
import createEmotionCache from "~/utils/createEmotionCache";
dayjs.extend(duration);

export const session: Session = {
  expires: "2022-10-20T11:00:00.000Z",
  user: {
    id: "test",
    name: "test",
    role: UserRoles.USER,
  },
};

export const clubSettings: ClubSettings = {
  id: "1",
  description: null,
  daysInThePastVisible: 2,
  daysInFutureVisible: 7,
  firstBookableHour: 8,
  firstBookableMinute: 0,
  lastBookableHour: 22,
  lastBookableMinute: 0,
  hoursBeforeCancel: 4,
  maxReservationPerUser: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const club: Club = {
  id: "1",
  name: "Club 1",
  clubSettingsId: "1",
  createdAt: new Date(),
  imageSrc: null,
  logoSrc: null,
  updatedAt: null,
};

export const courts: Court[] = [
  {
    clubId: club.id,
    id: "1",
    name: "Campo 1",
    beginTime: "BOTH",
    indoor: true,
    surface: "CLAY",
  },
  {
    clubId: club.id,
    id: "2",
    name: "Campo 2",
    beginTime: "BOTH",
    indoor: true,
    surface: "CLAY",
  },
];

export function getAdminSession(clubId: string): Session {
  return {
    ...session,
    user: {
      ...session.user,
      role: UserRoles.ADMIN,
      clubId: clubId,
    },
  };
}

/**
 * Component that provides to the children the contexts needed for testing.
 * It provides:
 * - Emotion cache (for ssr rendering)
 * - Theme (for MUI components)
 * - Localization (for using dayjs in MUI components)
 * - Session (for nextAuth)
 * - Trpc client (for trpc queries)
 * - React-query client (used internally by trpc)
 * @param children the component to be wrapped with the contexts
 * @param session the nextAuth session
 * @returns
 */
function WrapperComponentForTesting({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <CacheProvider value={createEmotionCache()}>
      <ThemeProvider theme={lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SessionProvider session={session}>
            <CalendarStoreProvider>
              <api.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                  {children}
                </QueryClientProvider>
              </api.Provider>
            </CalendarStoreProvider>
          </SessionProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

/**
 * Mounts the component wrapped with the contexts needed for testing.
 * The contexts provided are:
 * - Emotion cache (for ssr rendering)
 * - Theme (for MUI components)
 * - Localization (for using dayjs in MUI components)
 * - Session (for nextAuth)
 * - Trpc client (for trpc queries)
 * - React-query client (used internally by trpc)
 * @param children the component to be wrapped with the contexts
 * @param session the nextAuth session
 */

export const mountWithContexts = (
  children: React.ReactNode,
  session?: Session
) => {
  cy.mount(
    <WrapperComponentForTesting session={session}>
      {children}
    </WrapperComponentForTesting>
  );
};

export type ApiResponse<T> = {
  result: {
    data: {
      json: T;
    };
  };
};

export function buildApiResponse<T>(payload: T): ApiResponse<T> {
  return {
    result: {
      data: {
        json: payload,
      },
    },
  };
}

// ------- END OF FILE -------
// try to mock NextRouter (not succeed) - see:
// https://github.com/cypress-io/cypress/discussions/22715
// https://github.com/mike-plummer/nextjs-cypress-ct-example/blob/main/cypress/support/component.js
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { HeadManagerContext } from "next/dist/shared/lib/head-manager-context.shared-runtime";
import { CalendarStoreProvider } from "~/hooks/useCalendarStoreContext";

const createRouter = (params: Partial<AppRouterInstance>) => ({
  back: cy.spy().as("back"),
  forward: cy.spy().as("forward"),
  prefetch: cy.stub().as("prefetch").resolves(),
  push: cy.spy().as("push"),
  replace: cy.spy().as("replace"),
  refresh: cy.spy().as("refresh"),
  ...params,
});

const createHeadManager = () => ({
  updateHead: cy.stub().as("head:updateHead"),
  mountedInstances: new Set(),
  updateScripts: cy.stub().as("head:updateScripts"),
  scripts: new Set(),
  getIsSsr: () => false,
  appDir: false,
  nonce: "_",
});

interface MockNextRouterProps extends Partial<AppRouterInstance> {
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MockNextRouter = ({ children, ...props }: MockNextRouterProps) => {
  const router = createRouter(props as AppRouterInstance);
  const headManager = createHeadManager();
  return (
    <HeadManagerContext.Provider value={headManager}>
      <AppRouterContext.Provider value={router}>
        {children}
      </AppRouterContext.Provider>
    </HeadManagerContext.Provider>
  );
};
