import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, login } = useAuth();

  const [profile, setProfile] = useState({ username: '', email: '', phone: '', avatar: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError('');
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
      } catch (err) {
        setProfileError('Failed to load profile.');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profile.username.trim()) {
      setProfileError('Username cannot be empty.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', {
        username: profile.username,
        phone: profile.phone,
        avatar: profile.avatar,
      });
      setProfile(res.data);
      // Update AuthContext/localStorage so navbar etc. reflect new username
      const token = localStorage.getItem('token');
      login({ ...res.data, token });
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordError('Please fill in both password fields.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/users/password', passwordData);
      setPasswordSuccess('Password updated successfully.');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (profileLoading) {
    return <div className="text-center text-slate-500 py-20">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Account Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Profile Information</h2>

        {profileError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md px-4 py-2 mb-4">
            {profileError}
          </div>
        )}
        {profileSuccess && (
          <div className="bg-green-50 text-green-600 text-sm rounded-md px-4 py-2 mb-4">
            {profileSuccess}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-md px-3 py-2 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. 677123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
            <input
              type="text"
              name="avatar"
              value={profile.avatar}
              onChange={handleProfileChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="bg-slate-900 text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Change Password</h2>

        {passwordError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md px-4 py-2 mb-4">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="bg-green-50 text-green-600 text-sm rounded-md px-4 py-2 mb-4">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-slate-900 text-white px-6 py-2 rounded-md font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;