import { Route, Routes } from "react-router";
import AuthGuard from "./components/guards/AuthGuard";
import Workspace from "./features/workspace/Workspace";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import VerifyEmail from "./features/auth/VerifyEmail";
import CreateWorkspace from "./features/workspace/CreateWorkspace";
import AppGuard from "./components/guards/AppGuard";

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