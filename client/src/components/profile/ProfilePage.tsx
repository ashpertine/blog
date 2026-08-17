import { useAuth } from "../../contexts/AuthContext";
import NavigationGuard from "../auth/NavigationGuard";

function ProfilePage() {
  const { authUser } = useAuth();

  function parseDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  if(!authUser) return <div>Loading</div>

  return <NavigationGuard toUrl="/">
    <div className="py-4 mx-2 sm:mx-5 md:mx-10 lg:mx-20">
      <div className="bg-slate-700 w-full text-slate-100 rounded-sm p-2">
        <h1 className="text-3xl">Your Profile</h1>
        <hr className="border-slate-500"/>
        <div>
          <ul>
            <li>Name: {authUser.username}</li>
            <li>About: {authUser.bio}</li>
            <li>Account Created: {parseDate(authUser.created_date)}</li>
          </ul>
        </div>
      </div>
    </div>
  </NavigationGuard> 
}

export default ProfilePage