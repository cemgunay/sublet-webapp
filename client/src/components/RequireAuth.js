import { useLocation, Navigate, Outlet} from "react-router-dom"
import useAuth from "../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const { user: currentUser } = useAuth()
    const location = useLocation();

    return(
        currentUser
            ? <Outlet />
            : <Navigate to="/" state={{ from: location}} replace />
    )
}

export default RequireAuth