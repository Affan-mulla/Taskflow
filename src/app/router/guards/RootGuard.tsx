import { Navigate } from "react-router";
import useAuth from "@/features/auth/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { useWorkspace } from "@/features/workspace/hooks/useWorkspace";

/**
 * RootGuard handles the root route logic:
 * - Unauthenticated users: Show landing page
 * - Authenticated without workspace: Redirect to onboarding
 * - Authenticated with workspace: Redirect to first workspace
 */
const RootGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { workspace, loading: workspaceLoading } = useWorkspace(); 

  // Show loading spinner while checking auth and workspace status
  if (authLoading || (user && workspaceLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // User is not authenticated - show landing page
  if (!user) {
    return <>{children}</>;
  }

  // User is authenticated but has no workspace - redirect to onboarding
  if (!workspace || workspace.length === 0) {
    return <Navigate to="/onboarding/workspace" replace />;
  }

  // User is authenticated and has workspace(s) - redirect to first workspace
  if (workspace && workspace.length > 0) {
    return <Navigate to={`/${workspace[0].workspaceUrl}/projects`} replace />;
  }

  // Fallback to children (should not reach here)
  return <>{children}</>;
};

export default RootGuard;
