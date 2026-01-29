import { Navigate, Route, Routes } from "react-router";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import VerifyEmail from "@/features/auth/pages/VerifyEmail";
import { InvitePage } from "@/features/invite";

import AuthGuard from "./router/guards/AuthGuard";
import AppGuard from "./router/guards/AppGuard";
import RootGuard from "./router/guards/RootGuard";
import NotFoundPage from "@/Pages/NotFoundPage";
import LandingPage from "@/Pages/LandingPage";
import CreateWorkspace from "@/features/workspace/components/CreateWorkspace";
import WorkspaceLayout from "@/features/workspace/pages/WorkspaceLayout";
import Settings from "@/Pages/Settings";
import ProjectListPage from "@/features/projects/pages/ProjectListPage";
import ProjectPage from "@/features/projects/pages/ProjectPage";
import ProjectTaskPage from "@/features/projects/pages/ProjectTaskPage";
import ProjectOverviewPage from "@/features/projects/pages/ProjectOverviewPage";
import TaskOverviewPage from "@/features/tasks/pages/TaskOverviewPage";
import { useGetUserProfile } from "@/features/auth/hooks/useGetUserProfile";
import Team from "@/features/team/pages/Team";
import Board from "@/features/board/pages/Board";
import TaskBoard from "@/features/board/pages/TaskBoard";

export function App() {
  useGetUserProfile();
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <RootGuard>
            <LandingPage />
          </RootGuard>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/invite" element={<InvitePage />} />

      {/* Auth-Only Routes */}
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

      {/* Workspace Routes (Auth Required) */}
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
        {/* Default workspace view */}
        <Route index element={<Navigate to="projects" replace />} />
        <Route path="tasks" element={<ProjectTaskPage />} />
        <Route path="board" element={<Board />} />
          <Route path="team" element={<Team/>} />
        {/* Projects */}
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/:projectSlug" element={<ProjectPage />}>
          {/* Default to overview when landing on project */}
          <Route index element={<Navigate to="overview" replace />} />

          <Route path="overview" element={<ProjectOverviewPage />} />
          <Route path="board" element={<TaskBoard />} />
          <Route path="tasks" element={<ProjectTaskPage />} />
          <Route path="tasks/:taskSlug/overview" element={<TaskOverviewPage />} />
        </Route>

        {/* Workspace Settings */}
        <Route path="settings" element={<Settings />} />

        {/* 404 within workspace */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Global 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
