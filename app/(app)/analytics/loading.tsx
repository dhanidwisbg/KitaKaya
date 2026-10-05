export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-1.5">
        <div className="h-7 w-36 bg-surface-container-high rounded-xl animate-pulse" />
        <div className="h-4 w-60 bg-surface-container rounded-full animate-pulse" />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-surface-container-high rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-surface-container-high rounded-2xl animate-pulse" />
        <div className="h-64 bg-surface-container-high rounded-2xl animate-pulse" />
      </div>

      {/* Category list */}
      <div className="space-y-2.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-surface-container-high animate-pulse">
            <div className="w-3 h-3 rounded-full bg-surface-container-high" />
            <div className="flex-1 h-3 bg-surface-container rounded-full" />
            <div className="h-3 w-20 bg-surface-container-high rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
