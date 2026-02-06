# Taskflow

Taskflow is a real-time workspace for modern product teams. It combines project planning, task execution, and team alignment into one calm, fast, and always-in-sync experience.

If you want Linear-style clarity with a workspace-first model, Taskflow keeps strategy, execution, and updates connected so teams can plan, build, and ship without the usual chaos.

## Why Taskflow

- Realtime collaboration across projects, boards, and team views
- Workspace architecture that keeps teams and initiatives cleanly organized
- Kanban-style board with drag-and-drop and optimistic UI for instant feedback
- Project and task updates with status, links, and timelines
- Invites, team management, and workspace settings built-in
- Auth with email verification and Google sign-in

## What�s Inside

- Landing experience and marketing site in `src/Pages/LandingPage.tsx`
- Auth flow, onboarding, workspace creation, and route guards
- Projects, tasks, issues, and updates powered by Firestore
- Realtime listeners with optimistic UI, backed by Firestore snapshot updates
- Team + settings areas for profile, workspace, and member management

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Firebase Auth, Firestore, and Storage
- Zustand for client state
- dnd-kit for board interactions

## How It Works (High Level)

Taskflow follows a layered architecture so UI stays fast and predictable:

1. DB layer: Firestore-only functions in `src/db/`
2. Hooks layer: feature hooks for loading, mutations, and subscriptions
3. Store layer: Zustand for shared workspace state
4. UI layer: pages and components that never call Firestore directly

Realtime flow is simple and reliable:

1. UI triggers an optimistic update
2. DB writes to Firestore
3. Firestore `onSnapshot` updates listeners
4. Hooks + stores reconcile local state automatically

## Project Structure

```
src/
+-- app/                # App shell, routing, guards
+-- components/         # Reusable UI components
+-- db/                 # Firestore CRUD + listeners
+-- features/           # Domain features (auth, projects, tasks, board, etc.)
+-- lib/                # Firebase config + API helpers
+-- Pages/              # Marketing + static pages
+-- shared/             # Stores, types, utilities
```

## Environment Variables

Create a `.env` file in the project root with your Firebase project credentials and invite API URL.

```
VITE_FIREBASE_API_KEY="<your-api-key>"
VITE_FIREBASE_AUTH_DOMAIN="<your-auth-domain>"
VITE_FIREBASE_PROJECT_ID="<your-project-id>"
VITE_FIREBASE_STORAGE_BUCKET="<your-storage-bucket>"
VITE_FIREBASE_MESSAGING_SENDER_ID="<your-sender-id>"
VITE_FIREBASE_APP_ID="<your-app-id>"
VITE_FIREBASE_MEASUREMENT_ID="<your-measurement-id>"
VITE_EMAIL_SERVICE_API_URL="<invite-service-base-url>"
```

## Local Development

```
npm install
npm run dev
```

## Scripts

- `npm run dev`: start local dev server
- `npm run build`: typecheck and build
- `npm run lint`: run ESLint
- `npm run preview`: preview production build

## Key Domains

- Workspaces: top-level container for teams and projects
- Projects: initiatives with metadata, timelines, and ownership
- Tasks and issues: work items tracked across lists and boards
- Updates: progress summaries with status and links
- Invites: email-based onboarding with a separate invite API

---

If you want a more technical deep dive or a contributor guide, tell me what depth you want and I can expand the docs.
