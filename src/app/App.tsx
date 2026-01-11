import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import { Route, Routes } from "react-router";
import AuthGuard from "./router/guards/AuthGuard";
import CreateWorkspace from "@/features/workspace/components/CreateWorkspace";
import AppGuard from "./router/guards/AppGuard";
import RootGuard from "./router/guards/RootGuard";
import VerifyEmail from "@/features/auth/pages/VerifyEmail";
import LandingPage from "@/Pages/LandingPage";
import WorkspaceLayout from "@/features/workspace/pages/WorkspaceLayout";


export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <RootGuard><LandingPage /></RootGuard>} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/verify-email"
          element={
            <AuthGuard>
              <VerifyEmail />
            </AuthGuard>
          }
        />

        <Route 
        path="/onboarding/workspace"
        element={
          <AuthGuard>
            <CreateWorkspace />
          </AuthGuard>
        }
        />

        <Route
          path="/:workspaceUrl"
          element={
            <AuthGuard>
              <AppGuard>
                <WorkspaceLayout />
              </AppGuard>
            </AuthGuard>
          }
        >
          <Route path="/:workspaceUrl/projects" element={<div>Projects Page</div>} />
          
          <Route path="/:workspaceUrl//projects/:projectId/boards" element={<div>Boards Page</div>} />
          <Route path="/:workspaceUrl//projects/:projectId/tasks" element={<div>Boards Page</div>} />
          <Route path="/:workspaceUrl/tasks" element={<div>Tasks Page</div>} />
          <Route path="/:workspaceUrl/settings" element={<div>Settings Page</div>} />
          <Route path="/:workspaceUrl/boards" element={<div>Boards Page</div>} />

        </Route>
      </Routes>
    </>
  );
}

export default App;