import { Route, Routes } from "react-router";
import AuthGuard from "./features/auth/AuthGuard";
import Workspace from "./features/workspace/Workspace";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

export function App() {
  return (
    <>
      <Routes>
          <Route 
            path="/"
            element={
                <AuthGuard>
                    <Workspace/>
                </AuthGuard>
            }
          />
          <Route 
            path="/login"
            element={
                <Login/>
            }
          />
          <Route 
            path="/register"
            element={
                <Register/>
            }
          />
      </Routes>
    </>
  );
}

export default App;
