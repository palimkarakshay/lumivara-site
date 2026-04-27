import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import "./index.css";

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, err) => {
        const status = (err as { status?: number })?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return count < 2;
      },
      // Window-focus refetch + 30s polling stacked together caused
      // bursty parallel calls and intermittent secondary-rate-limit
      // 403s on phones that switch apps frequently. Off by default;
      // pull-to-refresh is the explicit refresh path.
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
