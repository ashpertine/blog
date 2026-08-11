import RegisterBox from "./RegisterBox"

function RegisterPage() {
  return <div className="flex flex-col h-screen font-app justify-center items-start bg-gray-800 px-8">
    <h1 className="text-gray-100 mb-4 text-4xl">Blogging Site</h1>
    <RegisterBox />
  </div>
}

export default RegisterPage;
