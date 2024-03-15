import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster richColors position="top-center" />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
