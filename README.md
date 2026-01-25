# Taskflow

A Linear-inspired, workspace-based task manager built with **React**, **TypeScript**, **Vite**, **Firebase Auth**, **Cloud Firestore**, **Zustand**, **Tailwind**, and **shadcn/ui**.

## Features

- **Real-time collaboration** — Project and issue changes sync instantly across all workspace members via Firestore listeners (no polling)
- **Workspace-based architecture** — Each workspace has its own projects, issues, and members
- **Optimistic UI** — Immediate feedback on updates, with Firestore handling consistency

## Architecture

```
src/
├── db/           # Pure Firestore functions (no React hooks)
├── features/     # Domain-specific hooks, components, pages
├── shared/       # Zustand stores, types, utilities
└── components/   # Reusable UI components
```

**Layered pattern:**
1. **DB Layer** — Pure Firestore functions (`createProject`, `listenToProjects`, `updateIssue`)
2. **Hooks Layer** — Async logic, subscriptions, loading/error state
3. **Zustand Layer** — Global state only (workspace, members, projects)
4. **UI Layer** — Calls hooks, no direct Firestore access

## Real-time Flow

1. UI triggers optimistic update → Hook calls DB function
2. Firestore write succeeds → `onSnapshot` fires for all clients
3. Listener updates Zustand/React state → Everyone sees the change

## Key Files

| Area | Files |
|------|-------|
| **Projects** | `db/projects/projects.read.ts` (listener), `db/projects/projects.update.ts` |
| **Issues** | `db/issues/` (create, read, update, delete) |
| **Hooks** | `features/projects/hooks/` (useIssues, useCreateIssue, useUpdateProject) |
| **Provider** | `features/workspace/components/WorkspaceProvider.tsx` |
| **Types** | `shared/types/db.ts` |

## Usage

```tsx
// Projects are automatically subscribed via WorkspaceProvider
const { projects, projectsLoading } = useWorkspaceStore();

// Issues (per-project real-time subscription)
const { issues, issuesByStatus, updateStatus } = useIssues({ projectId });

// Creating issues
const { createIssue, loading } = useCreateIssue();
```

## Getting Started

```bash
npm install
npm run dev
```
