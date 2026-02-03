const features = [
  {
    title: "Live team hubs",
    description:
      "Create spaces for every squad with shared goals, tasks, and progress snapshots.",
  },
  {
    title: "Priority aware",
    description:
      "Keep the roadmap honest with smart ordering and sprint-ready cut lines.",
  },
  {
    title: "Automatic insights",
    description:
      "Spot bottlenecks with weekly recaps, trend lines, and delivery forecasts.",
  },
  {
    title: "Focus mode",
    description:
      "Minimize noise with ambient updates, digest summaries, and calm reminders.",
  },
  {
    title: "Instant context",
    description:
      "Attach docs, prototypes, and decisions directly to the work that matters.",
  },
  {
    title: "Secure by design",
    description:
      "Granular permissions, audit trails, and SSO-ready access keep teams safe.",
  },
]

const steps = [
  {
    title: "Capture the signal",
    description:
      "Drop tasks in, link specs, and let Taskflow organize the important work.",
  },
  {
    title: "Plan with confidence",
    description:
      "Balance workload, align dependencies, and ship predictable milestones.",
  },
  {
    title: "Deliver with clarity",
    description:
      "Track progress, celebrate wins, and learn from every cycle.",
  },
]

const integrations = [
  "Notion",
  "Slack",
  "GitHub",
  "Figma",
  "Linear",
  "Zapier",
]

const testimonials = [
  {
    quote:
      "Taskflow turned our roadmap chaos into a calm, shared rhythm across teams.",
    name: "Ivy Chen",
    title: "Product Lead, Nova",
  },
  {
    quote:
      "The interface is clean, fast, and surprisingly delightful. It feels like Linear for strategy.",
    name: "Marcus Lee",
    title: "Head of Delivery, Orbit",
  },
  {
    quote:
      "We finally have a single source of truth that executives and builders both trust.",
    name: "Samira Patel",
    title: "VP Engineering, Drift",
  },
]

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
              T
            </span>
            Taskflow
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-600 lg:flex">
            <a className="transition hover:text-slate-900" href="#product">
              Product
            </a>
            <a className="transition hover:text-slate-900" href="#features">
              Features
            </a>
            <a className="transition hover:text-slate-900" href="#workflow">
              Workflow
            </a>
            <a className="transition hover:text-slate-900" href="#integrations">
              Integrations
            </a>
            <a className="transition hover:text-slate-900" href="#testimonials">
              Customers
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 md:inline-flex">
              Login
            </button>
            <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800">
              Start free
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200/60">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                New ✦ Taskflow 2.0
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Orchestrate product work with calm, connected clarity.
              </h1>
              <p className="text-lg text-slate-600">
                Taskflow blends strategy, execution, and insight into a single workspace
                built for modern teams. Move fast without losing the plot.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800">
                  Start your workspace
                </button>
                <button className="rounded-full border border-slate-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">
                  Watch the demo
                </button>
              </div>
              <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                <span>Trusted by 120+ product teams</span>
                <span>SOC2-ready security</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-12 top-8 h-56 w-56 rounded-full bg-indigo-200/60 blur-3xl" />
              <div className="absolute bottom-8 right-4 h-44 w-44 rounded-full bg-emerald-200/70 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur">
                <img
                  className="w-full motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-150 motion-safe:float-slow"
                  src="/landing/hero-illustration.svg"
                  alt="Taskflow interface preview"
                />
              </div>
              <div className="absolute -bottom-6 left-12 hidden rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-xs font-semibold text-slate-600 shadow-lg shadow-slate-900/10 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-300 lg:inline-flex">
                Shipping pulse: +18% this week
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="relative">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Product preview
                </p>
                <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                  A dashboard that feels like a mission control center.
                </h2>
                <p className="text-base text-slate-600">
                  Visualize initiatives, dependencies, and momentum in a layered workspace
                  designed to surface the signal.
                </p>
              </div>
              <button className="rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">
                Explore live preview
              </button>
            </div>

            <div className="relative mt-12 overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-100 p-10 shadow-2xl shadow-slate-900/10">
              <img
                className="absolute right-8 top-8 hidden h-40 w-40 opacity-70 motion-safe:float-slower lg:block"
                src="/landing/preview-illustration.svg"
                alt="Abstract preview illustration"
              />
              <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      <span>Portfolio view</span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-600">
                        On track
                      </span>
                    </div>
                    <div className="mt-6 grid gap-3">
                      <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/80 px-4 py-3 text-sm">
                        <span className="font-semibold text-slate-800">Core experience refresh</span>
                        <span className="text-xs text-slate-500">72%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/80 px-4 py-3 text-sm">
                        <span className="font-semibold text-slate-800">Workflow automation</span>
                        <span className="text-xs text-slate-500">54%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/80 px-4 py-3 text-sm">
                        <span className="font-semibold text-slate-800">New onboarding</span>
                        <span className="text-xs text-slate-500">86%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-slate-900/5 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Delivery
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">+18%</p>
                      <p className="text-sm text-slate-500">
                        Velocity improvement week over week.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-slate-900/5 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Risk radar
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">3</p>
                      <p className="text-sm text-slate-500">
                        Dependencies need attention this sprint.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-xl shadow-slate-900/20">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                      Focus list
                    </p>
                    <ul className="mt-5 space-y-3 text-sm">
                      <li className="rounded-xl bg-white/10 px-3 py-2">Launch enterprise plan</li>
                      <li className="rounded-xl bg-white/10 px-3 py-2">Complete API audit</li>
                      <li className="rounded-xl bg-white/10 px-3 py-2">Ship mobile sprint</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-slate-900/5 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Insight pulse
                    </p>
                    <p className="mt-4 text-sm text-slate-600">
                      “Teams that review weekly summaries are 2.3× more likely to hit
                      delivery goals.”
                    </p>
                    <p className="mt-4 text-xs font-semibold text-slate-500">
                      Taskflow Analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-slate-200/60 bg-white/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Features
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Every detail designed to keep teams aligned.
              </h2>
              <p className="text-base text-slate-600">
                A set of tools tuned for clarity, collaboration, and momentum across
                ambitious product teams.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                    ✦
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Workflow
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                A timeline that adapts to how your team ships.
              </h2>
              <p className="text-base text-slate-600">
                Map the journey from idea to impact with subtle guidance and complete
                transparency.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{step.description}</p>
                  <div className="mt-6 h-1 w-full rounded-full bg-slate-100">
                    <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-indigo-400 via-slate-900 to-emerald-400 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-2 motion-safe:delay-150" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="integrations" className="border-y border-slate-200/60 bg-white/70">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Integrations
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                  Plug into the tools you already trust.
                </h2>
              </div>
              <button className="rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">
                Browse integrations
              </button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {integrations.map((integration) => (
                <div
                  key={integration}
                  className="flex items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-4 py-5 text-sm font-semibold text-slate-500 shadow-sm backdrop-blur"
                >
                  {integration}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Testimonials
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Teams that move fast stay grounded with Taskflow.
              </h2>
              <p className="text-base text-slate-600">
                Hear how product leaders keep their roadmaps, rituals, and results aligned.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur"
                >
                  <blockquote className="text-sm text-slate-600">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm font-semibold text-slate-900">
                    {testimonial.name}
                    <span className="mt-1 block text-xs font-medium text-slate-500">
                      {testimonial.title}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 lg:grid-cols-[2fr,1fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Ready to move faster?
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Bring calm momentum to every product ritual.
              </h2>
              <p className="text-base text-white/70">
                Start with a free workspace, invite your team, and feel the difference in
                a single sprint.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5">
                Start free trial
              </button>
              <button className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5">
                Talk to sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/60 bg-white/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[2fr,1fr,1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
                T
              </span>
              Taskflow
            </div>
            <p className="text-sm text-slate-600">
              The calm command center for product teams who ship with intent.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Twitter</span>
              <span>LinkedIn</span>
              <span>Dribbble</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Product
            </p>
            <a className="block transition hover:text-slate-900" href="#">
              Overview
            </a>
            <a className="block transition hover:text-slate-900" href="#">
              Security
            </a>
            <a className="block transition hover:text-slate-900" href="#">
              Pricing
            </a>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Company
            </p>
            <a className="block transition hover:text-slate-900" href="#">
              About
            </a>
            <a className="block transition hover:text-slate-900" href="#">
              Careers
            </a>
            <a className="block transition hover:text-slate-900" href="#">
              Legal
            </a>
          </div>
        </div>
        <div className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-500">
          © 2024 Taskflow. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
