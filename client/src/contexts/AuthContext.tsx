import { useState, useEffect, useContext, createContext, type ReactNode } from "react";

type AuthUser = {
  username: string,
  token: string
}

type AuthContextType = {
  authUser: AuthUser | null;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  loggedIn: boolean | null;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
};

function useAuth() {
  const authContext = useContext(AuthContext);
  if (authContext === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);

  const value = {
    authUser,
    setAuthUser,
    loggedIn,
    setLoggedIn
  } as AuthContextType

  return <AuthContext value={value}>{children}</AuthContext>
}

export { useAuth, AuthProvider };
