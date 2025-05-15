import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to = "/" replace/>
    }

    return <>{children}</>
}