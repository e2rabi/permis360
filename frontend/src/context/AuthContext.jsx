import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AUTH_KEY = 'auto-ecole-auth-v1';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (auth) window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    else window.localStorage.removeItem(AUTH_KEY);
  }, [auth]);

  const loginAsManager = useCallback(() => setAuth({ role: 'manager' }), []);

  const loginAsStudent = useCallback((studentId) => setAuth({ role: 'student', studentId }), []);

  const logout = useCallback(() => setAuth(null), []);

  return (
    <AuthContext.Provider value={{ auth, loginAsManager, loginAsStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
