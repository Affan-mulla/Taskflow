import { Navigate } from "react-router";
import useAuth from "@/features/auth/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { useWorkspace } from "@/features/workspace/hooks/useWorkspace";

const AppGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { workspace, loading: workspaceLoading } = useWorkspace();

  if(!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (authLoading || workspaceLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  }

  if (!workspace || workspace.length === 0) {
    return <Navigate to="/onboarding/workspace" replace />;
  }

  return <>{children}</>;
};

export default AppGuard;