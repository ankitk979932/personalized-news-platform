import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, signupUser } from "../services/api.js";

const AuthContext = createContext(null);
const storageKey = "nuzio-auth";

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (error) {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const storedAuth = readStoredAuth();
  const [token, setToken] = useState(storedAuth.token || "");
  const [user, setUser] = useState(storedAuth.user || null);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem(storageKey, JSON.stringify(data));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (credentials) => {
    const data = await signupUser(credentials);
    localStorage.setItem(storageKey, JSON.stringify(data));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(token)
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
