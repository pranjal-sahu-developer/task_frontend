import { Navigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { isAuthenticated } from '../utils/auth';

function HomePage() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section>
      <StudentForm />
    </section>
  );
}

export default HomePage;
