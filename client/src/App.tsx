import BlogList from "./components/BlogList";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router";

function App() {
  const authValues = useAuth();

  function handleLogout() {
    authValues.logout();

    return <Navigate to="/" replace />
  }

  const authButtonStyle = "text-gray-100 hover:cursor-pointer hover:bg-violet-700 bg-violet-600 p-2 rounded-sm"
  const authButton = authValues.authUser ? <button className={authButtonStyle} onClick={handleLogout}>Log out</button> : <a className={authButtonStyle} href="login">Log in</a>;

  return <div>
    <div>
       {authButton}
    </div>
    <BlogList />
  </div>
}

export default App;