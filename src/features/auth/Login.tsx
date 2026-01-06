
import { AuthForm } from "./AuthForm";
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-foreground/5 to-background ">
      <AuthForm mode="login" />
    </div>
  );
};

export default Login;
