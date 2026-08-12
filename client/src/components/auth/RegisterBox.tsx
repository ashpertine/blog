import { useState } from "react";
import { registerUserApi } from "../../api/auth-api";
import { getAuthErrorBox } from "./AuthCommon";

function RegisterBox() {
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister(event: React.SubmitEvent<HTMLFormElement>, username: string, password: string, confirmPassword: string) {
    event.preventDefault();

    try {
      const json = await registerUserApi(username, password, confirmPassword);
      return json;
    } catch (error) {
      setError(error as Error);
    }
  }

  function setInput(event: React.ChangeEvent<HTMLInputElement>, input: "username" | "password" | "confirmPassword") {
    if (error) setError(null);

    switch (input) {
      case "username":
        setUsername(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        setConfirmPassword(event.target.value);
        break;
    }
  }

  return <form className="flex flex-col justify-center content-start gap-2 font-app rounded-lg bg-gray-600 px-4 py-4 shadow-lg text-gray-100" action="/api/login" method="POST" onSubmit={e => handleRegister(e, username, password, confirmPassword)}>
    {getAuthErrorBox(error)}
    <label htmlFor="username">Username</label>
    <input className="border border-stone-400 rounded bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black" type="text" id="username" name="username" onChange={e => setInput(e, "username")} />
    <div className="flex justify-between flex-wrap gap-2">
      <div className="flex flex-col flex-1">
        <label htmlFor="password">Password</label>
        <input className="border border-stone-400 rounded text-black bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" type="password" id="password" name="password" onChange={e => setInput(e, "password")} />
      </div>
      <div className="flex flex-col flex-1">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input className="border border-stone-400 rounded text-black bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" type="password" id="confirm-password" name="confirmPassword" onChange={e => setInput(e, "confirmPassword")} />
      </div>
    </div>
    <div className="flex gap-2 items-center">
      <button className="bg-sky-600 rounded-lg px-4 py-2 hover:bg-sky-700 hover:cursor-pointer border-sky-900 self-start" type="submit">Register</button>
      <a href="login" className="text-sky-300 underline">Login</a>
    </div>
  </form>
}

export default RegisterBox;
