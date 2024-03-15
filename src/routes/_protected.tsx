import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '@/app/hooks';
import { Navigate, Outlet } from '@tanstack/react-router';

const PrivateRoute = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export const Route = createFileRoute('/_protected')({
  component: () => <PrivateRoute />
})