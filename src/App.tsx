import { Route, Routes } from "react-router";
import AuthGuard from "./features/auth/AuthGuard";
import Workspace from "./features/workspace/Workspace";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import VerifyEmail from "./features/auth/VerifyEmail";

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
          path="/"
          element={
            <AuthGuard>
              <Workspace />
            </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;