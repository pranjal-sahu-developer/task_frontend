import { useNavigate } from 'react-router-dom';
import StudentList from '../components/StudentList';
import { removeToken } from '../utils/auth';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login', { replace: true });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back. Manage registered students below.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <StudentList />
    </section>
  );
}

export default DashboardPage;
