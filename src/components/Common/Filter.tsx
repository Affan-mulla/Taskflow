/**
 * Re-export ProjectFilter as the default Filter component.
 * This maintains backward compatibility while providing the new Linear-style UI.
 */
export { ProjectFilter as default } from "@/features/projects/components/ProjectFilter";
export type { FilterValue, FilterCategory } from "@/features/projects/components/ProjectFilter";
