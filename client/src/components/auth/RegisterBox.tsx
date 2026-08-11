function RegisterBox() {
  return <form className="flex flex-col justify-center content-start gap-2 font-app rounded-lg bg-gray-600 px-4 py-4 shadow-lg text-gray-100" action="/api/login" method="POST">
    <label htmlFor="username">Username</label>
    <input className="border border-stone-400 rounded bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black" type="text" id="username" name="username" />
    <div className="flex justify-between flex-wrap gap-2">
      <div className="flex flex-col flex-1">
        <label htmlFor="password">Password</label>
        <input className="border border-stone-400 rounded text-black bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" type="password" id="password" name="password" />
      </div>
      <div className="flex flex-col flex-1">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input className="border border-stone-400 rounded text-black bg-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" type="password" id="confirm-password" name="confirmPassword" />
      </div>
    </div>
    <button className="bg-sky-600 rounded-lg px-4 py-2 hover:bg-sky-700 hover:cursor-pointer border-sky-900 self-start" type="submit">Register</button>
  </form>
}

export default RegisterBox;
