import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import type { AppRouter } from "../../../backend/src/routers";

// Create tRPC React client
export const trpc = createTRPCReact<AppRouter>();

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    loggerLink(),
    httpBatchLink({
      url: "http://localhost:3001/trpc",
    }),
  ],
});
