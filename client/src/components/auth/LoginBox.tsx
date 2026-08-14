import { useState, useEffect } from "react";
import { getAuthErrorBox } from "./AuthCommon";
import { useAuth } from "../../contexts/AuthContext";

function LoginBox() {
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authValues = useAuth();

  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>, username: string, password: string) {
    event.preventDefault();
    try {
      await authValues.login(username, password);
    } catch (error) {
      setError(error as Error);
    }
  }

  function setInput(event: React.ChangeEvent<HTMLInputElement>, input: "username" | "password") {
    if (error) setError(null);

    switch (input) {
      case "username":
        setUsername(event.target.value);
        break;
      default:
        setPassword(event.target.value);
        break;
    }
  }


  return <form className="flex flex-col justify-center content-start gap-2 font-app rounded-lg bg-gray-600 px-4 py-4 shadow-lg text-gray-100" action="/api/login" method="POST" onSubmit={async (e) => await handleLogin(e, username, password)}>
      {getAuthErrorBox(error)}
      <label htmlFor="username">Username</label>
      <input className="border border-stone-400 rounded bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black" type="text" id="username" name="username" onChange={e => setInput(e, "username")} />
      <label htmlFor="password">Password</label>
      <input className="border border-stone-400 rounded text-black bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" type="password" id="password" name="password" onChange={e => setInput(e, "password")} />
      <div className="flex gap-2 items-center">
        <button className="bg-sky-600 rounded-lg px-4 py-2 hover:bg-sky-700 hover:cursor-pointer border-sky-900 self-start" type="submit">Login</button>
        <a href="register" className="text-sky-300 underline">Register</a>
      </div>
    </form>
}

export default LoginBox;
