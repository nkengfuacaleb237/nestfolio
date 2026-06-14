import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-amber-400">
        Nestfolio
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-amber-400 transition">
          Browse
        </Link>

        {user ? (
          <>
            <Link to="/my-listings" className="hover:text-amber-400 transition">
              My Listings
            </Link>
            <Link to="/create-listing" className="hover:text-amber-400 transition">
              Add Listing
            </Link>
            <Link to="/dashboard" className="hover:text-amber-400 transition">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-amber-400 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-amber-300 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-amber-400 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-amber-400 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-amber-300 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;