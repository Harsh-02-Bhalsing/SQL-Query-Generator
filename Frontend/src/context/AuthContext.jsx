import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);         // NEW
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch token with custom claims (forceRefresh=true ensures latest claims)
        const idTokenResult = await user.getIdTokenResult(true);  // NEW
        const role = idTokenResult.claims.role ?? "user";          // NEW — default to "user"

        setIsAuthenticated(true);
        setUserEmail(user.email);
        setUserId(user.uid);
        setCurrentUser(user);
        setUserRole(role);                                          // NEW
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserId(null);
        setCurrentUser(null);
        setUserRole(null);                                          // NEW
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    // State cleared automatically by onAuthStateChanged
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userId,
        userRole,       // NEW — exposed to consumers
        logout,
        loading,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);