// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

// Create a context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Unsubscribe from the observer when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
