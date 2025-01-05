import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};


