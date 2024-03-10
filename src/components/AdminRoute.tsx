import { useAppSelector } from '@/app/hooks';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { user } = useAppSelector((state) => state.auth);
    return user && user.account.isAdmin ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export default AdminRoute;