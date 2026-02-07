import { Link } from "react-router";

import ThemeToggler from "@/components/Common/ThemeToggler";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReveal } from "@/shared/hooks/useReveal";
import { HugeiconsIcon } from "@hugeicons/react";
import { File, Users } from "@hugeicons/core-free-icons";

type Feature = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  stat: string;
  variant: "collab" | "workspace" | "board";
};

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Foundations", href: "#foundations" },
  { label: "Modules", href: "#modules" },
  { label: "Resources", href: "#resources" },
];

const logoCloud = [
  "Product",
  "Design",
  "Engineering",
  "Operations",
  "Marketing",
  "Customer Success",
  "QA",
  "Leadership",
];

const pillars = [
  {
    title: "Plan with intent",
    description:
      "Define scope, priorities, and ownership so everyone knows what matters most.",
  },
  {
    title: "Build with focus",
    description:
      "Turn projects into structured tasks with status, ownership, and clear context.",
  },
  {
    title: "Ship with confidence",
    description: "Share updates that keep teams aligned and momentum high.",
  },
];

const featureBlocks: Feature[] = [
  {
    eyebrow: "Realtime Workspace",
    title: "Keep every view in sync as work changes.",
    description:
      "Taskflow keeps projects, tasks, and updates in sync. Changes appear instantly across lists, boards, and detail views so teams ship from the same reality.",
    bullets: [
      "Realtime updates across projects, tasks, and boards.",
      "Optimistic UI for instant feedback on every change.",
      "Firestore listeners keep teammates aligned without manual refresh.",
    ],
    stat: "Realtime sync powered by Firestore snapshots.",
    variant: "collab",
  },
  {
    eyebrow: "Workspace Architecture",
    title: "Organize work across projects without the sprawl.",
    description:
      "Workspaces connect people, projects, and priorities in one clean hierarchy. Stay fast as you scale without losing clarity.",
    bullets: [
      "Projects with summary, status, priority, and target dates.",
      "Tasks with assignees, status, attachments, and timelines.",
      "Issue-style workflows with consistent statuses and priorities.",
    ],
    stat: "Structured data keeps every project easy to navigate.",
    variant: "workspace",
  },
  {
    eyebrow: "Boards + Updates",
    title: "Visualize progress and share updates as you go.",
    description:
      "Move work with a fast Kanban board, then capture progress with project and task updates that keep everyone informed.",
    bullets: [
      "Drag-and-drop Kanban board with real-time state.",
      "Project and task updates with status and links.",
      "Dedicated detail pages for tasks and project context.",
    ],
    stat: "Boards and updates keep teams moving in lockstep.",
    variant: "board",
  },
];

const metrics = [
  { value: "Realtime", label: "Firestore snapshot updates" },
  { value: "Optimistic", label: "Instant UI feedback on changes" },
  { value: "Workspaces", label: "Projects, tasks, and team scoped" },
  { value: "Auth", label: "Email verification + Google sign-in" },
];

const modules = [
  "Workspaces",
  "Projects",
  "Tasks",
  "Boards",
  "Updates",
  "Team",
  "Settings",
  "Invites",
];

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Workflows", "Integrations", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Press"],
  },
  {
    title: "Resources",
    links: ["Docs", "Guides", "Community", "Status"],
  },
];

const revealClass = (visible: boolean) =>
  cn(
    "transition-all duration-700 motion-reduce:transition-none",
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  );

function HeroArt() {
  // Controls how many vertical strips build the V-shape.
  const stripCount = 28;
  // Midpoint used to compute distance for the V-depth curve.
  const mid = (stripCount - 1) / 2;
  const strips = Array.from({ length: stripCount }).map((_, index) => {
    const distance = Math.abs(index - mid);
    const intensity = 1 - distance / mid;
    // Push center strips down further to form the V.
    const depth = Math.round(intensity * 0);
    // Higher intensity = brighter glow and softer blur.
    const glow = 0.12 + intensity * 0.6;
    const blur = 1.5 + intensity * 0;

    return {
      index,
      distance,
      depth,
      glow,
      blur,
      opacity: 0.35 + intensity * 0.9,
    };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        // Fade the art as it moves down the page so it doesn't clash with content.
        maskImage:
          "radial-gradient(100% 80% at 80% 15%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "radial-gradient(100% 80% at 80% 15%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%)",
      }}
    >
      {/* Oversized canvas so tilt animation never shows empty corners. */}
      <div className="absolute left-1/2 top-[-22%] h-[150%] w-[150%] -translate-x-1/2">
        <div className="relative h-full w-full origin-top animate-hero-tilt motion-reduce:animate-none">
          {/* Base glow sitting behind everything. */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.3),transparent_70%)] opacity-80" />
          {/* Light rays: subtle, masked and blurred for depth. */}
          <div className="absolute inset-0 hero-rays opacity-70 blur-[10px] mix-blend-multiply dark:mix-blend-screen" />
          {/* Cool accent bloom to add color variation. */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,_rgba(56,189,248,0.22),_transparent_55%)] opacity-70" />
          <div
            className="grid h-full w-full gap-px mix-blend-screen"
            style={{
              gridTemplateColumns: `repeat(${stripCount}, minmax(0, 1fr))`,
            }}
          >
            {strips.map((strip) => (
              <div key={strip.index} className="relative">
                <div
                  className="absolute inset-0"
                  style={{ transform: `translateY(${strip.depth}px)` }}
                >
                  <div
                    className="h-full w-full rounded-[2px] animate-hero-strip motion-reduce:animate-none"
                    style={{
                      // Animated vertical gradient gives each strip a flowing glow.
                      backgroundImage: `linear-gradient(to bottom, rgba(99,102,241,0) 0%, rgba(99,102,241,${strip.glow}) 42%, rgba(56,189,248,${
                        strip.glow * 0.9
                      }) 62%, rgba(99,102,241,${strip.glow * 0.45}) 82%, rgba(99,102,241,0) 100%)`,
                      backgroundSize: "100% 220%",
                      backgroundPosition: "50% 0%",
                      filter: `blur(${strip.blur}px)`,
                      opacity: strip.opacity,
                      // Stagger timing so strips don't move in sync.
                      animationDelay: `${strip.index * 0.12}s`,
                      animationDuration: `${12 + strip.distance * 0.35}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Moving highlight that sweeps across the center. */}
          <div className="absolute inset-y-0 left-1/2 w-[42%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(99,102,241,0.26),transparent)] opacity-45 mix-blend-multiply animate-hero-glint motion-reduce:animate-none dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] dark:opacity-35 dark:mix-blend-screen" />
          {/* Subtle vignette to ground the effect. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(148,163,184,0.08),transparent_35%,rgba(148,163,184,0.18))] dark:bg-[linear-gradient(to_bottom,rgba(15,23,42,0.08),transparent_35%,rgba(15,23,42,0.18))]" />
        </div>
      </div>
    </div>
  );
}

function FeatureArt({
  variant,
  className,
}: {
  variant: Feature["variant"];
  className?: string;
}) {
  const base =
    "relative overflow-hidden rounded-xl border border-border bg-background/40 backdrop-blur sm:min-h-[260px] md:min-h-[320px]";

  if (variant === "collab") {
    return (
      <div className={cn(base, className, "border-0")}>
        <div className={"border p-2 rounded-xl border-border/60 "}>
          <div className="relative h-82 w-full rounded-lg border bg-card/40 p-4 text-muted-foreground shadow-[0_35px_100px_-80px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3 text-[11px] ">
              <span>
                <HugeiconsIcon icon={File} className="size-4" />
              </span>
              <span className="text-muted-foreground">Spice harvester</span>
              <span className="text-muted-foreground/25">&gt;</span>
              <span className="text-muted-foreground/70">Project specs</span>
              <span className="ml-auto text-muted-foreground/20">...</span>
            </div>
            <div className="mt-4 h-px w-full bg-muted-foreground/5" />

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex -space-x-2 bg-emerald-500/10 rounded p-1">
                  <HugeiconsIcon
                    icon={Users}
                    className="size-4 text-emerald-400"
                  />
                </div>
                <div>
                  <div className="text-[19px] font-semibold leading-tight text-foreground">
                    <span className="relative inline-flex">
                      <span className="absolute -top-3 -right-4 bg-emerald-600/20 text-[10px] text-emerald-700 dark:bg-emerald-800/60 dark:text-emerald-200">
                        zoe
                      </span>
                      <span className="ring-1 ring-emerald-500/70 dark:ring-emerald-500/80">
                        Collaborate
                      </span>
                    </span>
                    <span className="ml-2">on</span>
                    <span className="relative ml-2 inline-flex">
                      <span className=" ">ideas</span>
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Write down product ideas and work together on feature specs
                    in realtime, multiplayer project documents.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-muted-foreground/10" />
                <div className="h-2 w-11/12 rounded-full bg-muted-foreground/10" />
                <div className="h-2 w-9/12 rounded-full bg-muted-foreground/10" />
                <div className="h-2 w-7/12 rounded-full bg-muted-foreground/10" />
              </div>
            </div>
          </div>
          <div className="absolute left-20 top-14 h-28 w-28 rounded-full bg-emerald-400/15 blur-[80px]" />
          <div className=" absolute h-1/2 bg-linear-to-b from-transparent  to-background w-full bottom-0 left-0  " />
        </div>
      </div>
    );
  }

  if (variant === "workspace") {
    return (
      <div className={cn(base, className, "border-0")}>
        <div className="border p-2 rounded-xl border-border/60">
          <div className="relative w-full rounded-lg border bg-card/40 p-4 text-muted-foreground/80 shadow-[0_45px_120px_-70px_rgba(0,0,0,0.9)]">
            <div className="text-base font-semibold text-muted-foreground/90">
              Project Overview
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="grid grid-cols-[92px_1fr] items-start gap-4">
                <span className="text-muted-foreground/40">Properties</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-muted-foreground/10 bg-muted-foreground/5 px-3 py-1 text-xs text-amber-700 dark:text-amber-300">
                    <span className="h-2 w-2 rotate-45 rounded-[2px] bg-amber-300" />
                    In Progress
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-muted-foreground/10 bg-muted-foreground/5 px-3 py-1 text-xs text-foreground/60 dark:text-white/60">
                    <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/30" />
                    ENG
                  </span>
                  <div className="flex -space-x-2 pl-1">
                    <span className="h-6 w-6 rounded-full bg-muted-foreground/10 ring-1 ring-muted-foreground/10" />
                    <span className="h-6 w-6 rounded-full bg-muted-foreground/10 ring-1 ring-muted-foreground/10" />
                    <span className="h-6 w-6 rounded-full bg-muted-foreground/10 ring-1 ring-muted-foreground/10" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[92px_1fr] items-start gap-4">
                <span className="text-muted-foreground/40">Resources</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-muted-foreground/10 bg-muted-foreground/5 px-3 py-1 text-xs text-muted-foreground/70">
                    <span className="h-3 w-3 rounded-[4px] bg-[linear-gradient(135deg,#f97316,#facc15)]" />
                    Exploration
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-muted-foreground/10 bg-muted-foreground/5 px-3 py-1 text-xs text-muted-foreground/60">
                    <span className="h-3 w-3 rounded-[4px] bg-[linear-gradient(135deg,#22c55e,#16a34a)]" />
                    User interviews
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[92px_1fr] items-start gap-4">
                <span className="text-muted-foreground/40">Milestones</span>
                <div className="space-y-2 text-xs text-muted-foreground/50">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-indigo-400/80" />
                    <span className="text-muted-foreground/70">Design Review</span>
                    <span className="ml-auto text-muted-foreground/40">100%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-indigo-400/60" />
                    <span className="text-muted-foreground/60">Internal Alpha</span>
                    <span className="ml-auto text-muted-foreground/30">100% of 10</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-60">
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-amber-400/70" />
                    <span>GA</span>
                    <span className="ml-auto text-muted-foreground/30">25% of 53</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="h-2 w-full rounded-full bg-muted-foreground/10" />
              <div className="h-2 w-10/12 rounded-full bg-muted-foreground/10" />
            </div>
          </div>
          <div className="absolute left-20 top-14 h-28 w-28 rounded-full bg-amber-400/15 blur-[80px]" />
          <div className="absolute h-1/2 bg-linear-to-b from-transparent to-background w-full bottom-0 left-0" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(base, "perspective-1200", className, "border-0")}>
      <div className="border p-2 rounded-xl border-border/60">
        <div className="relative w-full rounded-lg border bg-card/40 p-4 text-muted-foreground/80 shadow-[0_45px_120px_-70px_rgba(0,0,0,0.9)]">
          <div className="relative h-55 w-full preserve-3d">
            <div
              className="group absolute left-4 top-8 w-[78%] rounded-2xl border border-border/70 bg-background/90 p-4 text-xs text-muted-foreground/70 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-4 hover:border-rose-400/40 hover:text-foreground/90 hover:shadow-[0_25px_70px_-40px_rgba(244,63,94,0.35)] dark:border-white/10 dark:bg-[#0b0e13]/70 dark:text-white/40 dark:hover:text-white/60 dark:hover:shadow-[0_25px_70px_-40px_rgba(244,63,94,0.5)] transform-gpu
-translate-z-30
-rotate-x-14
rotate-y-20
-skew-y-4
-translate-y-4
"
              style={{ "--z": "-28px" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30 transition-colors duration-300 group-hover:bg-rose-400/80 dark:bg-white/25" />
                Off track
              </div>
              <div className="mt-3 h-2 w-3/4 rounded-full bg-muted-foreground/15 dark:bg-white/10" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-muted-foreground/15 dark:bg-white/10" />
            </div>

            <div
              className="group absolute left-6 top-12 w-[80%] rounded-2xl border border-border/70 bg-background/95 p-4 text-xs text-muted-foreground/70 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:border-amber-300/40 hover:text-foreground/90 hover:shadow-[0_25px_70px_-40px_rgba(251,191,36,0.35)] dark:border-white/10 dark:bg-[#0b0e13]/80 dark:text-white/45 dark:hover:text-white/70 dark:hover:shadow-[0_25px_70px_-40px_rgba(251,191,36,0.55)] transform-gpu hover:[--z:-4px] hover:-translate-y-4
-translate-z-10
-rotate-x-14
rotate-y-20
-skew-y-4
translate-y-2
translate-x-4
"
              style={{ "--z": "-12px" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/35 transition-colors duration-300 group-hover:bg-amber-300/80 dark:bg-white/30" />
                At risk
              </div>
              <div className="mt-3 h-2 w-4/5 rounded-full bg-muted-foreground/15 dark:bg-white/10" />
              <div className="mt-2 h-2 w-2/3 rounded-full bg-muted-foreground/15 dark:bg-white/10" />
            </div>

            <div
              className="group absolute left-4 top-12 w-[84%] rounded-2xl border border-border/70 bg-card/95 p-5 text-sm text-foreground/75 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.42)] transition duration-300 hover:[--z:24px] hover:-translate-y-4 hover:brightness-105 hover:border-emerald-400/40 hover:shadow-[0_35px_100px_-60px_rgba(16,185,129,0.45)] dark:border-white/10 dark:bg-[#0b0e13]/95 dark:text-white/70 dark:hover:brightness-110 dark:hover:shadow-[0_35px_100px_-60px_rgba(16,185,129,0.65)] transform-gpu
translate-z-15
-rotate-x-14
rotate-y-20
-skew-y-4
translate-x-12
translate-y-8
  "
              style={{ "--z": "12px" } as React.CSSProperties}
            >
              <div className="absolute inset-0 rounded-xl bg-accent/80" />
              <div className="relative">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted-foreground/10 dark:bg-white/10">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/35 transition-colors duration-300 group-hover:bg-emerald-400 dark:bg-white/30" />
                  </span>
                  <span className="font-semibold text-foreground/70 transition-colors duration-300 group-hover:text-emerald-700 dark:text-white/60 dark:group-hover:text-emerald-300">
                    On track
                  </span>
                </div>
                <div className="mt-3 text-base font-medium text-foreground/90 dark:text-white/85">
                  We are ready to launch next Thursday
                </div>
                <div className="mt-3 text-xs text-muted-foreground dark:text-white/35">Sep 8</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-20 top-14 h-28 w-28 rounded-full bg-emerald-400/15 blur-[80px]" />
        <div className="absolute h-1/2 bg-linear-to-b from-transparent to-background w-full bottom-0 left-0" />
        <div className="absolute h-1/2 w-1/2 bg-linear-to-tr from-transparent to-background blur-2xl top-0 right-0" />
      </div>
    </div>
  );
}
function FeatureBlock({ feature, flip }: { feature: Feature; flip?: boolean }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2",
        revealClass(isVisible),
      )}
    >
      <div className={cn(flip && "lg:order-2")}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {feature.eyebrow}
        </p>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {feature.title}
        </h3>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {feature.description}
        </p>
        <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
          {feature.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{feature.stat}</span>
        </div>
      </div>
      <FeatureArt
        variant={feature.variant}
        className={cn(flip && "lg:order-1")}
      />
    </div>
  );
}

const LandingPage = () => {
  const hero = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const logos = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const pillarsReveal = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const foundations = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const integrationsReveal = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const cta = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="relative w-full overflow-hidden bg-background text-foreground transition-colors">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute right-[-10%] top-0 h-[32rem] w-[32rem] rounded-full bg-sky-400/10 blur-[180px]" />
        <div className="absolute inset-0 bg-grid opacity-20 dark:opacity-30" />
      </div>

      <header className=" absolute z-10 w-full">
        <div className="mx-auto w-full max-w-6xl px-6">
          <nav className="flex items-center justify-between py-6">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/taskflowLogo.svg"
                alt="Taskflow logo"
                className="h-7 w-7"
              />
              <span className="text-lg font-semibold tracking-normal">
                Taskflow
              </span>
            </Link>

            <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link to="/register" className={buttonVariants({ size: "sm" })}>
                Get started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative pb-24 pt-20 sm:pb-28 sm:pt-24 lg:pb-32 lg:pt-28">
          <HeroArt />
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              ref={hero.ref}
              className={cn("relative z-10", revealClass(hero.isVisible))}
            >
              <div className="max-w-2xl lg:max-w-3xl">
                <div className="flex flex-col gap-6 sm:gap-7">
                  <Badge className="bg-secondary/60 text-secondary-foreground">
                    Built for modern product teams
                  </Badge>
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    Run projects with clarity, speed, and calm momentum.
                  </h1>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Taskflow brings your team into a shared, realtime workspace
                    for planning, building, and shipping. Everything stays
                    organized, always visible, and effortlessly fast.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <Link
                      to="/register"
                      className={buttonVariants({ size: "lg" })}
                    >
                      Get started
                    </Link>
                    <a
                      href="#features"
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                      })}
                    >
                      View workflow
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground sm:gap-6">
                    <span>Realtime collaboration</span>
                    <span>Workspace-first architecture</span>
                    <span>Optimistic UI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              ref={logos.ref}
              className={cn(
                "rounded-3xl border border-border/60 bg-card/60 px-8 py-10 text-center",
                revealClass(logos.isVisible),
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Built for cross-functional teams
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                {logoCloud.map((logo) => (
                  <span
                    key={logo}
                    className="rounded-full border border-border/60 bg-background/60 px-4 py-2"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              ref={pillarsReveal.ref}
              className={cn(
                "text-center",
                revealClass(pillarsReveal.isVisible),
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Made for modern product teams
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Build alignment from strategy to execution.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className={cn(
                    "rounded-3xl border border-border/60 bg-card/60 p-6 text-left transition-all duration-500",
                    "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_60px_-40px_rgba(99,102,241,0.6)]",
                    "animate-fade-up motion-reduce:animate-none",
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="space-y-20">
              {featureBlocks.map((feature, index) => (
                <FeatureBlock
                  key={feature.title}
                  feature={feature}
                  flip={index % 2 === 1}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="foundations" className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              ref={foundations.ref}
              className={cn(
                "rounded-3xl border border-border/60 bg-card/60 px-8 py-10",
                revealClass(foundations.isVisible),
              )}
            >
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Built on strong foundations
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Reliability you can plan around.
                  </h2>
                  <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                    Taskflow is engineered for consistency, speed, and security
                    so your team can focus on shipping instead of chasing
                    updates.
                  </p>
                  <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                      Team invites with role-aware membership.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                      Optimistic UI backed by Firestore listeners.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                      Updates for projects and tasks keep everyone aligned.
                    </li>
                  </ul>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-border/60 bg-background/70 p-4"
                    >
                      <p className="text-2xl font-semibold text-foreground">
                        {metric.value}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="modules" className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              ref={integrationsReveal.ref}
              className={cn(
                "text-center",
                revealClass(integrationsReveal.isVisible),
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Core modules
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Everything you need to run the workspace.
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Taskflow ships with the essentials for planning, execution, and
                team coordination.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <div
                  key={module}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm"
                >
                  <span className="text-foreground">{module}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Built-in
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              ref={cta.ref}
              className={cn(
                "relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 px-8 py-12 text-center shadow-[0_40px_140px_-100px_rgba(99,102,241,0.7)]",
                revealClass(cta.isVisible),
              )}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-y-0 right-0 w-[70%]">
                  <div className="absolute right-[-35%] top-1/2 -translate-y-1/2 sm:right-[-24%] lg:right-[-12%]">
                    <div className="cta-orbit animate-cta-drift motion-reduce:animate-none">
                      <div className="cta-ring cta-ring-1" />
                      <div className="cta-ring cta-ring-2" />
                      <div className="cta-ring cta-ring-3" />
                      <div className="cta-ring cta-ring-4" />
                      <div className="cta-ring cta-ring-5" />
                      <div className="cta-ring cta-ring-6" />
                      <div className="cta-ring cta-ring-7" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(99,102,241,0.2),_transparent_65%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgba(79, 70, 229,0.1),_transparent_95%)]" />
              </div>
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Ready to move faster?
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Bring your workspace into Taskflow today.
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Start building with a workflow designed for teams who ship.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className={buttonVariants({ size: "lg" })}
                  >
                    Get started free
                  </Link>
                  <Link
                    to="/login"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="resources" className="border-t border-border/60 py-12">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/taskflowLogo.svg"
                  alt="Taskflow"
                  className="h-6 w-6"
                />
                <span className="text-sm font-semibold">Taskflow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A Linear-inspired workspace for teams who care about speed,
                clarity, and shipping.
              </p>
              <p className="text-xs text-muted-foreground">
                (c) 2026 Taskflow. All rights reserved.
              </p>
            </div>
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-3 text-sm">
                <p className="text-foreground font-semibold">{group.title}</p>
                <div className="space-y-2 text-muted-foreground">
                  {group.links.map((link) => (
                    <p key={link}>{link}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
