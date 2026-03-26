import { useToken } from '@store/useAppStore';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useToken();
  if (!token) return <Navigate to={'/auth'} />;
  return children;
};
