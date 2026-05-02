import { Building2, Home, LineChart, ShieldCheck, Sparkles, Workflow } from "lucide-react";

function AppCard({ icon: Icon, title, text, accent = "blue" }) {
  const accents = {
    blue: "from-blue-50 to-white text-blue-700 border-blue-100",
    emerald: "from-emerald-50 to-white text-emerald-700 border-emerald-100",
    slate: "from-slate-50 to-white text-slate-700 border-slate-200"
  };

  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${accents[accent]} p-5 shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <div className="space-y-6 pb-10">
      <section className="premium-panel overflow-hidden rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              <Sparkles className="h-4 w-4" /> Real-World Applications
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Smart grid learning that stays private while the network improves.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
              Federated learning lets homes contribute to energy forecasting without exposing raw consumption data. Differential privacy and secure aggregation make the distributed workflow safer for sensitive infrastructure.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm lg:w-[360px]">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Illustration</div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className="text-xs font-semibold text-slate-600">Grid</div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-200 via-emerald-200 to-transparent" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                  <Home className="h-7 w-7" />
                </div>
                <div className="text-xs font-semibold text-slate-600">Homes</div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Multiple homes send masked updates to the central grid coordinator. The coordinator aggregates the updates and improves energy forecasting for demand, load balancing, and peak planning.
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <AppCard
          icon={LineChart}
          title="Smart Grid Energy Forecasting"
          text="Predict demand from distributed households with local training on each node, then merge knowledge centrally to keep the model accurate and privacy-aware."
          accent="blue"
        />
        <AppCard
          icon={ShieldCheck}
          title="Privacy-preserving Distributed Learning"
          text="DP protects individual updates with controlled noise, while secure aggregation ensures the server only sees combined model information."
          accent="emerald"
        />
        <AppCard
          icon={Workflow}
          title="Operational Workflow"
          text="Clients train locally, upload updates over a multi-hop network, and the grid aggregates them into a more resilient forecasting model."
          accent="slate"
        />
        <AppCard
          icon={Building2}
          title="Deployment Story"
          text="This simulator maps directly to the energy domain: households, community transformers, and an aggregator that coordinates updates efficiently."
          accent="blue"
        />
      </div>
    </div>
  );
}
