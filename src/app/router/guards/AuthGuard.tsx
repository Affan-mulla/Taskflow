import { Spinner } from "@/shared/components/ui/spinner";
import useAuth from "@/features/auth/hooks/useAuth"
import { Navigate, useLocation } from "react-router"


export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const path = useLocation()
  
  if (loading) {
    return <div>
      <Spinner/>
    </div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if(user.emailVerified === false && path.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" replace />
  }

  return <>{children}</>
}
