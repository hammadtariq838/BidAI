import { useAppSelector } from '@/app/hooks';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const { user } = useAppSelector((state) => state.auth);
    return user ? <Navigate to="/" /> : <Outlet />;
}

export default PublicRoute;