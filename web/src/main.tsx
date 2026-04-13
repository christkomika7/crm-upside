import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./route";
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "./lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip"

import "./index.css";
import { NotificationProvider } from "./components/notification/notification-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Toaster position="top-right" />
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>
);
