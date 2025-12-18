import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth/useAuth";
import useRole from "../Hooks/useRole/useRole";
import LoadingSpinner from "../Componets/Loading/LoadingSpinner";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [role, isRoleLoading] = useRole();
    const location = useLocation();

    if (loading || isRoleLoading) {
        return <LoadingSpinner />;
    }

    if (user && role === 'admin') {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
