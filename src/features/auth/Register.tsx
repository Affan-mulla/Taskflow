import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { AuthForm } from "./AuthForm";
import type { RegisterFormData } from "@/validation/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const Register = () => {
  const router = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      // TODO: Implement your registration logic here
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match. Please confirm your password.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Notify user of successful registration
      if (userCredential.user) {
        toast.success("Registration successful! Please verify your email.");
        router("/verify-email");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-foreground/5 to-background ">
      <AuthForm<RegisterFormData> mode="register" onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
