import { Navigate } from "react-router"
import { useAuth } from "../../contexts/AuthContext"

type NavigationGuardProps = {
  inverse: boolean,
  toUrl: string,
  children: React.ReactNode
}

function NavigationGuard({ inverse = false , toUrl = "/login", children }: NavigationGuardProps ) {
  const { loggedIn } = useAuth();

  if(inverse) { // redirect to a url when going to an unprotected route
    return loggedIn ? <Navigate to={toUrl} replace /> : <>{children}</>;
  }else { //redirect o a url when going to a protected route
    return loggedIn ? <>{children}</> : <Navigate to={toUrl} replace />;
  }
}

export default NavigationGuard