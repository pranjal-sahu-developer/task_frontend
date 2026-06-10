import { Link, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

function Layout() {
  const isDashboard = useLocation().pathname === '/dashboard';

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold text-gray-900">
             Resolute Solutions
          </h1>
          {!isDashboard && (
            <nav className="flex gap-4 text-sm font-medium">
              {isAuthenticated() ? (
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
