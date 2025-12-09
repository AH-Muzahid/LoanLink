import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth/useAuth";
import LoadingSpinner from "../Componets/Loading/LoadingSpinner";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (user) {
        return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;