import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import ssaLogo from "@/assets/ssa-logo.jpg";
import { services } from "@/data/ssa";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);

  if (!service) return <Navigate to="/" replace />;

  const Icon = service.icon;

  return (
    <main className="min-h-screen bg-hero-field px-5 py-6 text-foreground sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
          <img src={ssaLogo} alt="Sherpa Strategic Advisors logo" className="h-12 w-12 rounded-full border border-primary/20 object-cover shadow-glow" />
          <span className="font-display text-lg font-bold text-summit">SSA</span>
        </Link>
        <Link to="/#services" className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/65 px-5 py-3 text-sm font-extrabold text-summit backdrop-blur transition-colors hover:bg-card">
          <ArrowLeft className="h-4 w-4" /> Services
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
        <div className="rounded-[2rem] border border-primary/15 bg-glass-card p-8 shadow-elevated backdrop-blur">
          <div className="mb-8 inline-flex rounded-2xl bg-peak-flow p-4 text-primary-foreground shadow-glow">
            <Icon className="h-9 w-9" />
          </div>
          <p className="mb-3 font-display text-sm font-bold uppercase text-ridge">SSA Service</p>
          <h1 className="text-3xl font-bold leading-tight text-summit sm:text-4xl md:text-5xl lg:text-6xl">{service.title}</h1>
          <p className="mt-6 text-lg font-semibold leading-8 text-ink-soft">{service.text}</p>
        </div>

        <div className="grid gap-5">
          <article className="rounded-3xl border border-primary/15 bg-card/72 p-7 shadow-elevated backdrop-blur">
            <h2 className="text-2xl font-bold text-summit">Problem statement</h2>
            <p className="mt-3 font-semibold leading-7 text-ink-soft">{service.problem}</p>
          </article>
          <article className="rounded-3xl border border-primary/15 bg-card/72 p-7 shadow-elevated backdrop-blur">
            <h2 className="text-2xl font-bold text-summit">Sherpa’s solution</h2>
            <p className="mt-3 font-semibold leading-7 text-ink-soft">{service.solution}</p>
          </article>
          <article className="rounded-3xl border border-primary/15 bg-card/72 p-7 shadow-elevated backdrop-blur">
            <h2 className="text-2xl font-bold text-summit">Key deliverables</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.deliverables.map((deliverable) => (
                <div key={deliverable} className="flex items-center gap-3 font-bold text-ink-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-ridge" /> {deliverable}
                </div>
              ))}
            </div>
          </article>
          <div className="rounded-3xl bg-peak-flow p-7 text-primary-foreground shadow-glow">
            <p className="font-display text-3xl font-bold">{service.metric}</p>
            <Link to="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 font-extrabold text-primary transition-transform hover:-translate-y-1">
              Request a proposal <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;