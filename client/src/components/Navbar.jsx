import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const linkClass =
    'text-sm font-medium text-[#1C1B1A]/70 hover:text-[#1C1B1A] transition-colors';

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E8E2D6]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-semibold text-[#1C1B1A]">
          Nestfolio
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkClass}>Browse</Link>
          {user && <Link to="/my-listings" className={linkClass}>My Listings</Link>}
          {user && <Link to="/dashboard" className={linkClass}>Dashboard</Link>}

          {user ? (
            <>
              <Link
                to="/create-listing"
                className="text-sm font-medium bg-[#C1622D] text-white px-4 py-2 rounded-full hover:bg-[#a8521f] transition-colors border-none shadow-sm"
              >
                Add Listing
              </Link>
              <button onClick={handleLogout} className={linkClass}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Log in</Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-[#C1622D] text-white px-4 py-2 rounded-full hover:bg-[#a8521f] transition-colors border-none shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#1C1B1A]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E8E2D6] bg-[#FAF6F0] px-4 sm:px-6 py-4 flex flex-col gap-4">
          <Link to="/" className={linkClass} onClick={() => setMenuOpen(false)}>Browse</Link>
          {user && (
            <Link to="/my-listings" className={linkClass} onClick={() => setMenuOpen(false)}>
              My Listings
            </Link>
          )}
          {user && (
            <Link to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/create-listing"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium bg-[#C1622D] text-white px-4 py-2 rounded-full text-center border-none shadow-sm"
              >
                Add Listing
              </Link>
              <button onClick={handleLogout} className={`${linkClass} text-left`}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium bg-[#C1622D] text-white px-4 py-2 rounded-full text-center border-none shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;