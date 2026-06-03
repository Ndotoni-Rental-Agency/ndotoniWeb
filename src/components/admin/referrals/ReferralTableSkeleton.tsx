export function ReferralTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50">
            {['w-20', 'w-36', 'w-36', 'w-28', 'w-24', 'w-28', 'w-24', 'w-16'].map((w, i) => (
              <th key={i} className="px-4 py-3">
                <div className={`h-3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse ${w}`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {['w-16', 'w-32', 'w-32', 'w-24', 'w-20', 'w-24', 'w-20', 'w-10'].map((w, ci) => (
                <td key={ci} className="px-4 py-3.5">
                  <div className={`h-3.5 rounded bg-gray-100 dark:bg-gray-700/60 animate-pulse ${w}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
