import { useAuth } from "../../contexts/AuthContext";
import AuthButton from "../auth/AuthButton";
import ProfileButton from "../profile/ProfileButton";

function HomepageButtons() {
  const authValues = useAuth();
  const profileButton = authValues.authUser ? <ProfileButton /> : null;
  return <div className="flex gap-2">
    <AuthButton />
    {profileButton}
  </div>
}

export default HomepageButtons