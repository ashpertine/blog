import RegisterBox from "./RegisterBox"
import LoginBox from "./LoginBox";
import NavigationGuard from "./NavigationGuard";

type AuthPageProps = {
  isLogin: boolean
}

function AuthPage({ isLogin }: AuthPageProps) {
  return <NavigationGuard inverse={true} toUrl="/">
    <div className="flex flex-col h-screen font-app justify-center items-start px-8">
      <h1 className="text-gray-100 mb-4 text-4xl">Blogging Site</h1>
      {isLogin ? <LoginBox /> : <RegisterBox /> }
    </div>
  </NavigationGuard> 
  
}

export default AuthPage;
