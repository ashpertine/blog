import { useNavigate } from "react-router";

function ProfileButton() {
  const navigate = useNavigate();

  function goToProfile() {
    return navigate("/profile")
  }

  const profileButtonStyle = "text-gray-100 hover:cursor-pointer hover:bg-blue-700 bg-blue-600 p-2 rounded-sm"
  return <button className={profileButtonStyle} onClick={goToProfile}>My Profile</button> 
}

export default ProfileButton;