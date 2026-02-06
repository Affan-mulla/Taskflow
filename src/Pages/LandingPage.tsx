import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useReveal } from "@/shared/hooks/useReveal"

type Feature = {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  stat: string
  variant: "collab" | "workspace" | "board"
}

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Foundations", href: "#foundations" },
  { label: "Integrations", href: "#integrations" },
  { label: "Resources", href: "#resources" },
]

const logoCloud = [
  "Northwind",
  "Brightline",
  "Skyforge",
  "Lumen",
  "Pulse Labs",
  "Copper",
  "Orbit",
  "Novu",
]

const pillars = [
  {
    title: "Plan with intent",
    description:
      "Set clear cycles, map dependencies, and keep strategy visible for the entire workspace.",
  },
  {
    title: "Build with focus",
    description:
      "Turn initiatives into structured tasks with status, ownership, and realtime context.",
  },
  {
    title: "Ship with confidence",
    description:
      "Stay ahead of blockers with instant updates, insights, and a shared source of truth.",
  },
]

const featureBlocks: Feature[] = [
  {
    eyebrow: "Realtime Collaboration",
    title: "Move together with live updates everywhere.",
    description:
      "Taskflow keeps every teammate in sync. Changes ripple instantly across projects, boards, and views so everyone ships from the same reality.",
    bullets: [
      "Live cursors, instant activity feed, and zero-refresh updates.",
      "Presence that shows who is working on what in real time.",
      "Smart notifications that focus on what matters now.",
    ],
    stat: "Sync in near real time across every workspace view.",
    variant: "collab",
  },
  {
    eyebrow: "Workspace Architecture",
    title: "Organize work across projects without the sprawl.",
    description:
      "Workspaces connect people, projects, and priorities in one clean hierarchy. Stay fast as you scale without losing clarity.",
    bullets: [
      "Projects, cycles, and issues keep scope crystal clear.",
      "Unified views across teams and initiatives.",
      "Structured metadata for effortless filtering and reporting.",
    ],
    stat: "Designed for teams that grow without slowing down.",
    variant: "workspace",
  },
  {
    eyebrow: "Boards + Optimistic UI",
    title: "Drag, drop, and ship faster with optimistic workflows.",
    description:
      "Updates feel instant with optimistic UI, while smart workflows help you move work with confidence across Kanban and timeline views.",
    bullets: [
      "Boards built for speed with real-time state.",
      "Optimistic updates keep momentum high.",
      "One-click transitions and automated status logic.",
    ],
    stat: "Built for uninterrupted flow and clarity.",
    variant: "board",
  },
]

const metrics = [
  { value: "99.9%", label: "Designed uptime target" },
  { value: "<100ms", label: "Realtime sync latency goal" },
  { value: "24/7", label: "Global availability design" },
  { value: "SOC-Ready", label: "Security-first foundations" },
]

const integrations = [
  "Slack",
  "GitHub",
  "Figma",
  "Notion",
  "Google Drive",
  "Linear",
  "Loom",
  "Stripe",
]

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
]

const revealClass = (visible: boolean) =>
  cn(
    "transition-all duration-700 motion-reduce:transition-none",
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  )

function HeroArt() {
  // Controls how many vertical strips build the V-shape.
  const stripCount = 28
  // Midpoint used to compute distance for the V-depth curve.
  const mid = (stripCount - 1) / 2
  const strips = Array.from({ length: stripCount }).map((_, index) => {
    const distance = Math.abs(index - mid)
    const intensity = 1 - distance / mid
    // Push center strips down further to form the V.
    const depth = Math.round(intensity * 0)
    // Higher intensity = brighter glow and softer blur.
    const glow = 0.12 + intensity * 0.6
    const blur = 1.5 + intensity * 0

    return {
      index,
      distance,
      depth,
      glow,
      blur,
      opacity: 0.35 + intensity * 0.9,
    }
  })

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
          <div className="absolute inset-0 hero-rays opacity-65 blur-[10px] mix-blend-screen" />
          {/* Cool accent bloom to add color variation. */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,_rgba(56,189,248,0.22),_transparent_55%)] opacity-70" />
          <div
            className="grid h-full w-full gap-px mix-blend-screen"
            style={{ gridTemplateColumns: `repeat(${stripCount}, minmax(0, 1fr))` }}
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
          <div className="absolute inset-y-0 left-1/2 w-[42%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-35 mix-blend-screen animate-hero-glint motion-reduce:animate-none" />
          {/* Subtle vignette to ground the effect. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.08),transparent_35%,rgba(15,23,42,0.18))]" />
        </div>
      </div>
    </div>
  )
}

function FeatureArt({
  variant,
  className,
}: {
  variant: Feature["variant"]
  className?: string
}) {
  const base =
    "relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 shadow-[0_30px_120px_-80px_rgba(15,23,42,0.5)] backdrop-blur"

  if (variant === "collab") {
    return (
      <div className={cn(base, className)}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Team presence</span>
          <span>Live updates</span>
        </div>
        <div className="mt-6 space-y-3">
          {["Design review", "API handshake", "Launch notes"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm"
            >
              <span className="text-foreground">{item}</span>
              <span className="text-xs text-emerald-500">Active</span>
            </div>
          ))}
        </div>
        <div className="absolute -right-6 top-10 h-24 w-24 rounded-full bg-primary/20 blur-[70px] animate-glow motion-reduce:animate-none" />
        <div className="absolute -left-6 bottom-8 rounded-2xl border border-border/70 bg-background/80 px-3 py-2 text-[11px] text-muted-foreground shadow-sm backdrop-blur animate-float motion-reduce:animate-none">
          5 teammates collaborating
        </div>
      </div>
    )
  }

  if (variant === "workspace") {
    return (
      <div className={cn(base, className)}>
        <div className="text-xs text-muted-foreground">Workspace map</div>
        <div className="mt-5 space-y-3">
          {["Workspace", "Projects", "Issues"].map((item, index) => (
            <div
              key={item}
              className={cn(
                "rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm font-medium text-foreground",
                index === 1 && "ml-6",
                index === 2 && "ml-12"
              )}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-[11px] text-muted-foreground">
          <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2">
            Cycles
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2">
            Views
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2">
            Automations
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(base, className)}>
      <div className="text-xs text-muted-foreground">Board view</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {["Backlog", "In progress", "Review"].map((col) => (
          <div
            key={col}
            className="rounded-2xl border border-border/70 bg-background/70 p-3 text-[11px] text-muted-foreground"
          >
            <div className="mb-2 text-foreground">{col}</div>
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-muted/60" />
              <div className="h-2 rounded-full bg-primary/50" />
              <div className="h-2 rounded-full bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute -left-6 bottom-8 rounded-2xl border border-border/70 bg-background/80 px-3 py-2 text-[11px] text-muted-foreground shadow-sm backdrop-blur animate-float-slow motion-reduce:animate-none">
        Optimistic updates on move
      </div>
    </div>
  )
}

function FeatureBlock({
  feature,
  flip,
}: {
  feature: Feature
  flip?: boolean
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2",
        revealClass(isVisible)
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
  )
}

const LandingPage = () => {
  const hero = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const logos = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const pillarsReveal = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const foundations = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const integrationsReveal = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const cta = useReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div className="relative overflow-hidden bg-background text-foreground w-full">
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
              <Link
                to="/register"
                className={buttonVariants({ size: "sm" })}
              >
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
              className={cn(
                "relative z-10",
                revealClass(hero.isVisible)
              )}
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
                revealClass(logos.isVisible)
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Trusted by focused teams
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
              className={cn("text-center", revealClass(pillarsReveal.isVisible))}
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
                    "animate-fade-up motion-reduce:animate-none"
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="text-sm font-semibold">
                      {index + 1}
                    </span>
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
                revealClass(foundations.isVisible)
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
                      Built-in audit trails and workspace-level permissions.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                      Optimistic UI with reliable Firestore reconciliation.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" />
                      Designed for real-time collaboration at scale.
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

        <section id="integrations" className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div
              ref={integrationsReveal.ref}
              className={cn("text-center", revealClass(integrationsReveal.isVisible))}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Integrations
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Connect the tools you already rely on.
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Designed to plug into your stack with clean, lightweight
                connections.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {integrations.map((integration) => (
                <div
                  key={integration}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm"
                >
                  <span className="text-foreground">{integration}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Planned
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
                revealClass(cta.isVisible)
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
  )
}

export default LandingPage
