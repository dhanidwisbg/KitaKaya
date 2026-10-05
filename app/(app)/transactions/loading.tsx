export default function TransactionsLoading() {
  return (
    <div className="space-y-6 pt-2">
      {/* Page header */}
      <div className="space-y-1.5">
        <div className="h-7 w-44 bg-surface-container-high rounded-xl animate-pulse" />
        <div className="h-4 w-64 bg-surface-container rounded-full animate-pulse" />
      </div>

      {/* AI Omnibar skeleton */}
      <div className="h-16 w-full bg-surface-container-high rounded-2xl animate-pulse" />

      {/* Mode toggle */}
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-surface-container-high rounded-full animate-pulse" />
        <div className="h-8 w-24 bg-surface-container rounded-full animate-pulse" />
      </div>

      {/* Filter row */}
      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-surface-container-high rounded-full animate-pulse" />
        <div className="h-10 w-28 bg-surface-container-high rounded-full animate-pulse" />
      </div>

      {/* Transaction list */}
      <div className="space-y-2.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-surface-container-high animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-40 bg-surface-container-high rounded-full" />
              <div className="h-3 w-28 bg-surface-container rounded-full" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="h-4 w-24 bg-surface-container-high rounded-full" />
              <div className="h-5 w-16 bg-surface-container rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
