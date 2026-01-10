import { Navigate } from "react-router";

import useAuth from "@/features/auth/hooks/useAuth";
import { Spinner } from "@/shared/components/ui/spinner";
import { useWorkspaceCheck } from "@/features/workspace/hooks/useWorkspace";

const AppGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { workspaceIds, loading: workspaceLoading } = useWorkspaceCheck();

  if (authLoading || workspaceLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  }

  if (workspaceIds?.length === 0) {
    return <Navigate to="/onboarding/workspace" replace />;
  }

  return <>{children}</>;
};

export default AppGuard;
