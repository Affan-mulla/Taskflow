import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import { Route, Routes } from "react-router";
import AuthGuard from "./router/guards/AuthGuard";
import CreateWorkspace from "@/features/workspace/components/CreateWorkspace";
import AppGuard from "./router/guards/AppGuard";
import Workspace from "@/features/workspace/pages/Workspace";
import VerifyEmail from "@/features/auth/pages/VerifyEmail";


export function App() {
  return (
    <>
      <Routes>

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
          path="/"
          element={
            <AuthGuard>
              <AppGuard>
                <Workspace />
              </AppGuard>
            </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;