import { useState, useEffect, useContext, createContext, type ReactNode } from "react";
import { loginUserApi, getProfileApi } from "../api/auth-api";
import { FetchError, type responseData } from "../api/base";

const TOKEN_NAME = "token";

type AuthUser = {
  id: number,
  username: string,
  bio: string,
  profile_picutre: string,
  created_date: string,
  permissions: string[],
  jwt: string
}

type AuthContextType = {
  authUser: AuthUser | null,
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  login: (username: string, password: string) => void,
  logout: () => void,
  hasPermission: (permission: string) => boolean
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
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(username: string, password: string) {
    const body = await loginUserApi(username, password) as responseData;
    if (!body.token) throw new Error('Token not found on response body');
    const jwt = body.token;
    localStorage.setItem(TOKEN_NAME, jwt);

    const { user } = await getProfileApi(jwt) as { user: AuthUser };
    setAuthUser({ ...user, jwt });
  }

  async function logout() {
    localStorage.removeItem(TOKEN_NAME);
    setAuthUser(null);
  }

  function hasPermission(permission: string): boolean {
    if (!authUser) return false;

    return authUser.permissions.includes(permission);
  }

  useEffect(() => {
    const jwt = localStorage.getItem(TOKEN_NAME);
    if (jwt === null) {
      setLoading(false);
      return;
    }
    getProfileApi(jwt).then(body => {
      const user = body.user as AuthUser;
      setAuthUser({ ...user, jwt });
      setLoading(false);
      return;
    }).catch(error => {
      if (error instanceof FetchError && error.statusCode === 401) {
        logout();
        return;
      }

      return error;
    })
  }, [])

  const value = {
    authUser,
    setAuthUser,
    loading,
    setLoading,
    login,
    logout,
    hasPermission
  } as AuthContextType

  return <AuthContext value={value}>{children}</AuthContext>
}

export { useAuth, AuthProvider };
