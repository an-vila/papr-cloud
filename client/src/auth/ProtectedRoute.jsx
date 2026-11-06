import { Spinner } from "@/components/ui/Spinner";
import { useApp } from "@/context/AppContext";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center">
        <Spinner size="lg" className="text-orange-600" />
        <p className="text-sm text-slate-500 font-medium">
          Loading PAPR Cloud...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />
};

export default ProtectedRoute;
