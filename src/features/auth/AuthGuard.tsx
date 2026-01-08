import useAuth from "@/hooks/useAuth"
import { Navigate } from "react-router"


export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if(user.emailVerified === false){
    return <Navigate to="/verify-email" replace />
  }

  return <>{children}</>
}
