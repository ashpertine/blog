import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router";

function AuthButton() {
  const authValues = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    authValues.logout();

    return navigate("/", { replace: true})
  }

  const authButtonStyle = "text-gray-100 hover:cursor-pointer hover:bg-violet-700 bg-violet-600 p-2 rounded-sm"
  const authButton = authValues.authUser ? <button className={authButtonStyle} onClick={handleLogout}>Log out</button> : <NavLink className={authButtonStyle} to="login">Log in</NavLink>;

  return authButton;
}

export default AuthButton;