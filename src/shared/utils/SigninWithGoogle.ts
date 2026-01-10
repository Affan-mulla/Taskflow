import { useUser } from "@/features/auth/hooks/useUsers";
import { auth } from "@/lib/firebase";
import { deleteUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function signInWithGoogle() {
  const { createUser } = useUser();
  try {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

    const result = await signInWithPopup(auth, googleProvider);

    if (result.user && result.user.email) {
      const user = await createUser(result.user.uid, {
        email: result.user.email,
        name: result.user.displayName || "Unnamed User",
        createdAt:
          result.user.metadata.creationTime || new Date().toISOString(),
        avatar: result.user.photoURL || undefined,
      });

      if (user.success === false) {
        await deleteUser(result.user);
        throw new Error(user.error);
      }
    }

    return result.user;
  } catch (err: any) {
    if (err.code === "auth/popup-closed-by-user") {
      return;
    }

    if (err.code === "auth/account-exists-with-different-credential") {
      throw new Error(
        "Account exists with a different sign-in method. Use email/password."
      );
    }

    throw err;
  }
}
