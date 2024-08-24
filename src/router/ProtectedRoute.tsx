// import { Outlet } from 'react-router-dom';
import { useUser } from '../context/AuthContext';
import NotFoundPage from '../pages/404';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUser();
  if (!user) {
    // or you can redirect to a different page and show a message
    return <NotFoundPage />;
  }
  // return <Outlet />;
  return children;
};

export default ProtectedRoute;
