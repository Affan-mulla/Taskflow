import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function signInWithGoogle() {
  try {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

    const result = await signInWithPopup(auth, googleProvider);

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
