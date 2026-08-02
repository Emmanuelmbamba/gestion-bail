  /* eslint-disable react-refresh/only-export-components */
  import { createContext, useState } from "react";

  // Small helper to decode JWT payload without external dependency
  function decodeJwt(token) {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(payload)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  export const AuthContext = createContext(null);

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = decodeJwt(token);
          if (decoded.exp * 1000 > Date.now()) {
            return {
              id: decoded.id,
              nom: decoded.nom,
              email: decoded.email,
              role: decoded.role
            };
          } else {
            localStorage.removeItem("token");
          }
        } catch {
          localStorage.removeItem("token");
        }
      }
      return null;
    });

    const logout = () => {
      localStorage.removeItem("token");
      setUser(null);
    };

    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          logout
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }