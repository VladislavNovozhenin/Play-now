import { isNullOrUndefined } from '@shared/common/helpers';
import { useGetUser } from '@store/useAppStore';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
};
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useGetUser();
  if (isNullOrUndefined(user)) return <Navigate to={'/auth'} />;
  return children;
};
