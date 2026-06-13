import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { isAuthenticated } from '../utils/auth';

function LoginPage() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginForm />;
}

export default LoginPage;
