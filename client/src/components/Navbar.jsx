import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const linkClass =
    "relative text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#F5A623] after:transition-all after:duration-300 hover:after:w-full";

  const primaryBtnClass =
    "group relative overflow-hidden border-2 border-[#F5A623] text-[#F5A623] px-4 py-2 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:text-[#0A0F1E] hover:shadow-lg hover:shadow-[#F5A623]/30 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-[#F5A623] before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 before:-z-10";

  return (
    <header className="sticky top-0 z-50 bg-[#0A0F1E] border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#F5A623] rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <span className="text-[#0A0F1E] font-bold text-sm">N</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Nestfolio</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkClass}>Browse</Link>
          {user && <Link to="/my-listings" className={linkClass}>My Listings</Link>}
          {user && <Link to="/dashboard" className={linkClass}>Dashboard</Link>}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/create-listing" className={primaryBtnClass}>
                + Add Listing
              </Link>
              <button onClick={handleLogout} className={linkClass}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Log in</Link>
              <Link to="/register" className={primaryBtnClass}>
                Sign up free
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white"
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

      {menuOpen && (
        <div className="md:hidden bg-[#0A0F1E] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link to="/" className="text-white/70 text-sm font-medium" onClick={() => setMenuOpen(false)}>Browse</Link>
          {user && <Link to="/my-listings" className="text-white/70 text-sm font-medium" onClick={() => setMenuOpen(false)}>My Listings</Link>}
          {user && <Link to="/dashboard" className="text-white/70 text-sm font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {user ? (
            <>
              <Link to="/create-listing" onClick={() => setMenuOpen(false)} className="bg-[#F5A623] text-[#0A0F1E] px-4 py-2 rounded-lg text-sm font-semibold text-center">
                + Add Listing
              </Link>
              <button onClick={handleLogout} className="text-white/70 text-sm font-medium text-left">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/70 text-sm font-medium" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-[#F5A623] text-[#0A0F1E] px-4 py-2 rounded-lg text-sm font-semibold text-center">
                Sign up free
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
