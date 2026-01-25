# Taskflow Real-Time Projects & Issues

This app is a Linear-inspired, workspace-based task manager built with React, TypeScript, Vite, Firebase Auth, Cloud Firestore, Zustand, Tailwind, and shadcn/ui. Recent work adds full real-time collaboration for projects and issues using Firestore listeners (no polling, no sockets).

## What was added

- Real-time project listener: `listenToProjects(workspaceId)` in `src/db/projects/projects.read.ts` uses `onSnapshot` to stream create/update/delete events.
- Project subscription hook: `useProjects()` in `src/features/projects/hooks/useProjects.ts` syncs Firestore → Zustand and manages loading state.
- Workspace provider update: `WorkspaceProvider` now attaches the real-time projects listener and keeps members as a one-time fetch.
- Issues data layer: CRUD + listener under `src/db/issues/` (`createIssue`, `listenToIssues`, `updateIssue*`, `deleteIssue`).
- Issues hooks: `useIssues` (real-time per project with optimistic updates + Kanban grouping) and `useCreateIssue` for creating tasks.
- Types: `Issue`, `IssueStatus`, `IssuePriority` added to `src/shared/types/db.ts`.

## How it works (flow)

1) UI triggers optimistic update → Hook calls DB updater.
2) Firestore write succeeds → `onSnapshot` fires for all clients.
3) Hook listener updates Zustand/React state → Everyone sees the change instantly.

## Key files

- Projects
	- `src/db/projects/projects.read.ts` — `listenToProjects`
	- `src/features/projects/hooks/useProjects.ts` — subscription hook
	- `src/features/workspace/components/WorkspaceProvider.tsx` — wires projects listener
- Issues
	- `src/db/issues/issues.create.ts` — create
	- `src/db/issues/issues.read.ts` — `listenToIssues`
	- `src/db/issues/issues.update.ts` — field-specific updates (status/priority/assignee/title/description)
	- `src/db/issues/issues.delete.ts` — delete
	- `src/features/projects/hooks/useIssues.ts` — real-time + optimistic updates + Kanban grouping
	- `src/features/projects/hooks/useCreateIssue.ts` — create hook
- Types
	- `src/shared/types/db.ts` — `Issue`, `IssueStatus`, `IssuePriority`

## Usage hints

- Projects: Call `useProjects()` anywhere inside the `WorkspaceProvider` tree; access `projects` and `loading` from the hook.
- Issues: Call `useIssues({ projectId })`; use `updateStatus/priority/assignee` for Kanban/inline edits, `issuesByStatus` for column rendering.
- Creation: Use `useCreateIssue()` and existing `useCreateProject()`; listeners will sync new items automatically.

## Architecture constraints kept

- DB layer: Pure Firestore functions, no hooks/Zustand inside.
- Hooks: Handle async + subscriptions; no direct state stored in DB layer.
- Zustand: Global state only (workspace, members, projects), no Firestore calls.
- No project-level permissions; workspace members see all projects and issues.
