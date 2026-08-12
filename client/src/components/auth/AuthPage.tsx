import RegisterBox from "./RegisterBox"
import LoginBox from "./LoginBox";

type AuthPageProps = {
  isLogin: boolean
}

function AuthPage({ isLogin }: AuthPageProps) {
  return <div className="flex flex-col h-screen font-app justify-center items-start px-8">
    <h1 className="text-gray-100 mb-4 text-4xl">Blogging Site</h1>
    {isLogin ? <LoginBox /> : <RegisterBox /> }
  </div>
}

export default AuthPage;
