import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";

import type { RegisterFormData } from "@/features/auth/validation/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useUser } from "@/features/auth/hooks/useUsers";
import { AuthForm } from "../components/AuthForm";

const Register = () => {
  const router = useNavigate();
  const { createUser } = useUser();

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

      if (userCredential.user && userCredential.user.email) {
        const user = await createUser(
          userCredential.user.uid,{
            email: userCredential.user.email,
            name: userCredential.user.displayName ,
            createdAt: userCredential.user.metadata.creationTime || new Date().toISOString(),
            avatar: userCredential.user.photoURL || undefined,
          }
        );
        if (user.success === false) {
          await deleteUser(userCredential.user);
          toast.error(`User creation failed: ${user.error}`);
          return;
        }
      }
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
