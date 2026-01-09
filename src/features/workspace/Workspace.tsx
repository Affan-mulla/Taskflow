import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const Workspace = () => {

  const handleLogout = async() => {
    await signOut(auth);
  }
  return (
    <div>
      <Button onClick={handleLogout}>
        Logout
      </Button>
      {auth.currentUser?.email}
      Workspace
    </div>
  )
}

export default Workspace