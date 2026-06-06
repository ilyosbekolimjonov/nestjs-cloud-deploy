import { useRoutes, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import ActivityLogs from "../pages/ActivityLogs";
import Home from "../pages/Home";
import Login from "../pages/Login";

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

const MainRouter = () => {
    const token = localStorage.getItem('token');
    const isAdmin = token ? parseJwt(token)?.role === 'admin' : false;

    return useRoutes([
        {
            path: '/login',
            element: isAdmin ? <Navigate to="/" replace /> : <Login />
        },
        {
            path: '/',
            element: isAdmin ? <Dashboard /> : <Navigate to="/login" replace />,
            children: [
                { index: true, element: <Home /> },
                { path: 'users', element: <Users /> },
                { path: 'operations', element: <ActivityLogs /> }
            ]
        },
        {
            path: '*',
            element: <div style={{ padding: '20px', color: 'red' }}>Page not found (404)</div>
        }
    ]);
};

export default MainRouter;