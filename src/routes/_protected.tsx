import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '@/app/hooks';
import { Navigate, Outlet } from '@tanstack/react-router';
import Navbar from '@/components/Navbar';

const PrivateRoute = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? (
    <main className="flex flex-col mx-auto min-h-screen bg-[F9F9FB]">
      <Navbar />
      <div className="h-10 bg-white mx-[53px]" />
      <div className='flex bg-[#F2DCA6] grow pt-2 px-2 mx-[53px]'>
        <Outlet />
      </div >
    </main >
  ) : <Navigate to="/sign-in" replace />;
}

export const Route = createFileRoute('/_protected')({
  component: () => <PrivateRoute />
})