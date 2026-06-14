import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if a user session exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Called after successful login/register
  const login = (userData) => {
    const { token, ...userInfo } = userData;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  // Called on logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);