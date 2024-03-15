import { createFileRoute } from '@tanstack/react-router'

import { useAppSelector } from '@/app/hooks';
import { Navigate, Outlet } from '@tanstack/react-router';

const PublicRoute = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? <Navigate to="/" /> : <Outlet />;
}

export const Route = createFileRoute('/_auth')({
  component: () => <PublicRoute />
})