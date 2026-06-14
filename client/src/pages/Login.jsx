import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email.trim() || !formData.password) {
      return 'Please enter both email and password.';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Welcome back
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 rounded-md font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-500 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;