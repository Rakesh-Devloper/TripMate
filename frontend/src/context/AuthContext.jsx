import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('tripmate_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('tripmate_token'));
  const [initialChecking, setInitialChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) { if (alive) setInitialChecking(false); return; }
      try { const data = await authService.me(); const currentUser = data.user || data.data || data; if (alive) { setUser(currentUser); localStorage.setItem('tripmate_user', JSON.stringify(currentUser)); } }
      catch { if (alive) { setUser(null); setToken(null); localStorage.removeItem('tripmate_token'); localStorage.removeItem('tripmate_user'); } }
      finally { if (alive) setInitialChecking(false); }
    })();
    return () => { alive = false; };
  }, [token]);
  const login = useCallback(async (credentials) => { setLoading(true); try { const data=await authService.login(credentials); const currentUser=data.user || data.data; if(!data.token || !currentUser) throw new Error('Invalid authentication response from server.'); setToken(data.token); setUser(currentUser); localStorage.setItem('tripmate_token',data.token); localStorage.setItem('tripmate_user',JSON.stringify(currentUser)); return {...data,user:currentUser}; } finally { setLoading(false); } }, []);
  const register = useCallback(async (payload) => { setLoading(true); try { const data=await authService.register(payload); const currentUser=data.user || data.data; if(data.token && currentUser){setToken(data.token);setUser(currentUser);localStorage.setItem('tripmate_token',data.token);localStorage.setItem('tripmate_user',JSON.stringify(currentUser));} return {...data,user:currentUser}; } finally { setLoading(false); } }, []);
  const logout = useCallback(async () => { try { await authService.logout(); } catch {} finally { setUser(null); setToken(null); localStorage.removeItem('tripmate_token'); localStorage.removeItem('tripmate_user'); } }, []);
  const value = useMemo(() => ({ user, token, loading, initialChecking, isAuthenticated: Boolean(user && token), login, register, logout, setUser }), [user, token, loading, initialChecking, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
