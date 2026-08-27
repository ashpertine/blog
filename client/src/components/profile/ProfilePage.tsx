import { useAuth } from "../../contexts/AuthContext";
import BlogList from "../blog/BlogList";
import NavigationGuard from "../auth/NavigationGuard";
import ErrorBox from "../ErrorBox.tsx";
import { useNavigate } from "react-router";
import { createPostApi } from "../../api/posts-api.ts";
import { useState, useEffect } from "react";

export function parseDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function ProfilePage() {
  const { authUser, hasPermission } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  function createNewPost() {
    if (!authUser) {
      setError(new Error("You are not logged in!"));
      return
    }

    createPostApi(null, null, authUser.jwt).then(body => {
      const postId: number = body.post.id;
      return navigate(`/edit/${postId}`);
    }).catch(error => {
      setError(error as Error);
    })
  }

  return <NavigationGuard toUrl="/">
    {!authUser ? null :
      <div className="py-4 mx-2 sm:mx-5 md:mx-10 lg:mx-20">
        <div className="bg-slate-700 mb-2 w-full text-slate-100 rounded-sm p-2">
          <h1 className="text-3xl">Your Profile</h1>
          <hr className="border-slate-500" />
          <div>
            <ul>
              <li>Name: {authUser.username}</li>
              <li>About: {authUser.bio}</li>
              <li>Account Created: {parseDate(authUser.created_date)}</li>
            </ul>
          </div>
        </div>
        <div className="profile-btn-group mb-2 flex justify-end">
          {hasPermission("createPost") ? <button className="bg-green-700 rounded-sm p-2 text-slate-100 cursor-pointer hover:bg-green-800" onClick={createNewPost}>New Post</button> : null};
        </div>
        <div className="bg-slate-700 text-slate-100 w-full rounded-sm p-2">
          <h1 className="text-3xl">Your Posts</h1>
          <BlogList fromUser={authUser.id} showListButtons={true} />
        </div>
      </div>
    }
  </NavigationGuard>
}

export default ProfilePage
