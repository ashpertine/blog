import { Navigate } from "react-router"
import { useAuth } from "../../contexts/AuthContext"

type NavigationGuardProps = {
  inverse?: boolean,
  toUrl: string,
  children: React.ReactNode
}

function NavigationGuard({ inverse = false, toUrl = "/login", children }: NavigationGuardProps) {
  const { authUser, loading } = useAuth();

  if (loading) return <div>
    <h1 className="text-gray-100">Loading</h1>
  </div>


  if (inverse) { // redirect to a url when going to an unprotected route
    return authUser !== null ? <Navigate to={toUrl} replace /> : <>{children}</>;
  } else { //redirect o a url when going to a protected route
    return authUser !== null ? <>{children}</> : <Navigate to={toUrl} replace />;
  }
}

export default NavigationGuard
