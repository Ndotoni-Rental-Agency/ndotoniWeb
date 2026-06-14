import { ShieldCheck, Eye, Code } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="overflow-hidden bg-ink-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">The Problem</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-500">
          Renting in Tanzania is painful, opaque, and risky for both tenants and landlords.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'No Trust',
              description: 'Tenants get scammed. Landlords list through unreliable brokers with no accountability.',
            },
            {
              icon: Eye,
              title: 'No Transparency',
              description: 'No verified photos, no standard pricing, no way to compare properties online.',
            },
            {
              icon: Code,
              title: 'No Technology',
              description: 'The $60M+ rental market still runs on phone calls, word-of-mouth, and paper receipts.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <item.icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
