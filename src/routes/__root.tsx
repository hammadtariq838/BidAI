import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner';
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster richColors position="top-center" />
      <main className="flex flex-col mx-auto min-h-screen bg-[F9F9FB]">
        <Navbar />
        <div className="h-10 bg-white mx-[53px]" />
        <div className='flex bg-[#F2DCA6] grow pt-2 px-2 mx-[53px]'>
          <Outlet />
        </div >
      </main >
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
})
