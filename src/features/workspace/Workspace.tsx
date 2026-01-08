import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { toast } from 'sonner'

const Workspace = () => {
  const handleLogout = async() => {
    await signOut(auth)
    toast.success("Logged out successfully")
    
  }
  return (
    <div>
      <Button onClick={handleLogout}>
        Logout
      </Button>
      {auth.currentUser?.email}
    </div>
  )
}

export default Workspace