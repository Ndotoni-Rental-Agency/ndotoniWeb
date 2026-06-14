export function MarketSection() {
  return (
    <section className="overflow-hidden bg-ink-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Market Opportunity</h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: '$60M+', label: 'Rental market (Dar)' },
            { stat: '6M+', label: 'Population in Dar' },
            { stat: '0', label: 'Tech competitors' },
            { stat: '20%+', label: 'Internet growth YoY' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-sm">
              <p className="text-2xl font-bold text-brand-600">{item.stat}</p>
              <p className="mt-2 text-sm text-ink-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
