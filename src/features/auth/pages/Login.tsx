
import { signInWithEmailAndPassword } from "firebase/auth";

import type { LoginFormData } from "@/features/auth/validation/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { AuthForm } from "../components/AuthForm";

const Login = () => {
  const router = useNavigate();
  const handleLogin = async (data: LoginFormData) => {
    try {
      const user = await signInWithEmailAndPassword(auth, data.email, data.password);
      if (user.user) {
        toast.success("Login successful! Welcome back.");
        router("/");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-foreground/5 to-background ">
      <AuthForm<LoginFormData> mode="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
