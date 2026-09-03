import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();

/**
 * Fetches the role claim from the Firebase ID token.
 *
 * On production hosts (e.g. Render), onAuthStateChanged can fire before
 * custom claims have fully propagated into the token. We force-refresh the
 * token once, and if the claim still isn't there we wait 2 s and retry once
 * more before falling back to "user". This covers cold-start race conditions
 * without blocking the UI indefinitely.
 */
async function fetchRole(user) {
  // First attempt — force refresh to bypass the local token cache
  let tokenResult = await user.getIdTokenResult(true);
  let role = tokenResult.claims.role;

  if (!role) {
    // Wait 2 s for claim propagation then retry once
    await new Promise((resolve) => setTimeout(resolve, 2000));
    tokenResult = await user.getIdTokenResult(true);
    role = tokenResult.claims.role;
  }

  return role ?? "user"; // safe default
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail]             = useState(null);
  const [userId, setUserId]                   = useState(null);
  const [userRole, setUserRole]               = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [currentUser, setCurrentUser]         = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchRole(user);

        setIsAuthenticated(true);
        setUserEmail(user.email);
        setUserId(user.uid);
        setCurrentUser(user);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserId(null);
        setCurrentUser(null);
        setUserRole(null);
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
        userRole,
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
