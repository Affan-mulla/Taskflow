// Components
export { ProjectListHeader } from "./ProjectListHeader";
export { ProjectTableHeader } from "./ProjectTableHeader";
export { EntityRow } from "./EntityRow";
export { ProjectRow } from "./ProjectRow"; // Legacy - consider removing
export { ProjectCard } from "./ProjectCard";
export { ProjectListContainer } from "./ProjectListContainer";
export { ProjectListSkeleton, ProjectTableSkeleton, ProjectCardSkeleton } from "./ProjectListSkeleton";
export { ProjectFilter, FilterSummary } from "./ProjectFilter";

// Inline edit components
export * from "./inline";

// Hooks
export { useProjectInlineEdit } from "./useProjectInlineEdit";
export { useEntityInlineEdit } from "./useEntityInlineEdit";

// Types & constants
export * from "./projects.types";
export type { FilterValue, FilterCategory } from "./ProjectFilter";

// Utilities
export * from "./projects.utils";
