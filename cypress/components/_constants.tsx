import { CacheProvider, ThemeProvider } from "@emotion/react";
import { type EventImpl } from "@fullcalendar/core/internal";
import { type ResourceApi } from "@fullcalendar/resource";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { type Club, type ClubSettings, type Court } from "@prisma/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, type TRPCClientErrorLike } from "@trpc/client";
import {
  type UseTRPCMutationResult,
  type UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { type SinonStub } from "cypress/types/sinon";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import superjson from "superjson";
import { MergedStoreProvider } from "~/hooks/useCalendarStoreContext";
import lightTheme from "~/styles/lightTheme";
import { api, getBaseUrl } from "~/utils/api";
import { UserRoles } from "~/utils/constants";
import createEmotionCache from "~/utils/createEmotionCache";

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

export const eventDetailsSingle: EventImpl = {
  id: "my_id",
  extendedProps: {
    userId: session.user.id,
  },
  start: dayjs(),
  end: dayjs(),
  getResources() {
    return [
      {
        title: "Campo 1",
      } as ResourceApi,
    ];
  },
} as unknown as EventImpl;

export const eventDetailsRecurrent: EventImpl = {
  ...eventDetailsSingle,
  extendedProps: {
    recurrentId: "my_recurrent_id",
    ...eventDetailsSingle.extendedProps,
  },
} as unknown as EventImpl;

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
  session: Session | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false } },
      }),
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <CacheProvider value={createEmotionCache()}>
      <ThemeProvider theme={lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <SessionProvider session={session}>
            <MergedStoreProvider>
              <api.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                  {children}
                </QueryClientProvider>
              </api.Provider>
            </MergedStoreProvider>
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
  session: Session | null,
) => {
  cy.mount(
    <WrapperComponentForTesting session={session}>
      {children}
    </WrapperComponentForTesting>,
  );
};

/**
 * Builds a mock of the trpc mutation hook with the given stub and input variables.
 * The returned object can be set in the store in place of the real mutation hook.
 * @param stub cypress stub to be used as mutation
 * @param inputVariables input for the mutation
 * @returns a mock of the trpc mutation hook
 */
export function buildTrpcMutationMock<TData, TVariables>(
  stub: SinonStub,
  inputVariables: TVariables,
): UseTRPCMutationResult<
  TData,
  TRPCClientErrorLike<never>,
  TVariables,
  unknown
> {
  return {
    data: undefined,
    error: null,
    status: "idle",
    mutate: stub,
    context: undefined,
    isError: false,
    isLoading: false,
    isSuccess: false,
    reset: () => {},
    isIdle: true,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    variables: inputVariables,
    mutateAsync: stub.resolves(),
    trpc: { path: "" },
  };
}

/**
 * Builds a mock of the trpc query hook with the given mocked data
 * The returned object can be set in the store in place of the real query hook.
 * @param mockData mock data to be returned by the query
 * @returns a mock of the trpc query hook
 */
export function buildTrpcQueryMock<TData>(
  mockData: TData,
): UseTRPCQueryResult<TData, TRPCClientErrorLike<never>> {
  return {
    data: mockData,
    error: null,
    status: "success",
    isError: false,
    isLoading: false,
    isSuccess: true,
    refetch: () =>
      new Promise((resolve) => resolve(buildTrpcQueryMock(mockData))),
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    isLoadingError: false,
    isFetching: false,
    isFetched: true,
    dataUpdatedAt: Date.now(),
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchStatus: "idle",
    isFetchedAfterMount: true,
    isInitialLoading: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    remove: () => {},
    trpc: { path: "" },
  };
}
