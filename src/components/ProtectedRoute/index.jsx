import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";

const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const userRole = user.role.name;

    if (isAdminRoute && userRole !== 'NORMAL_USER') {
        return (<>{ props.children }</>)
    } else {
        return <NotPermitted />;
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector((state) => state.account);
    return ( 
        <>
            {
                isAuthenticated ? 
                    <RoleBaseRoute>{ props.children }</RoleBaseRoute>
                    :
                    <Navigate to='/'/>
            }
        </>
     );
}
 
export default ProtectedRoute;