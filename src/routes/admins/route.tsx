import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '@/app/hooks'
import { Navigate, Outlet } from '@tanstack/react-router'

const AdminRoute = () => {
  const { user } = useAppSelector((state) => state.auth)
  return user && user.account.isAdmin ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export const Route = createFileRoute('/admins')({
  component: () => <AdminRoute />
})