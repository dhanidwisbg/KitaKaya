export default function DashboardLoading() {
  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2">
      {/* Greeting skeleton */}
      <div className="space-y-2 pt-1">
        <div className="h-3 w-28 bg-surface-container-high rounded-full animate-pulse" />
        <div className="h-9 w-52 bg-surface-container-high rounded-xl animate-pulse" />
        <div className="h-4 w-72 bg-surface-container rounded-full animate-pulse mt-1" />
      </div>

      {/* Hero wealth card */}
      <div className="h-56 w-full bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl animate-pulse" />

      {/* 3-col goals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-surface-container-high rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-surface-container-high rounded-2xl animate-pulse" />
        <div className="h-48 bg-surface-container-high rounded-2xl animate-pulse" />
      </div>

      {/* Recent transactions */}
      <div className="space-y-3">
        <div className="h-5 w-40 bg-surface-container-high rounded-full animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-2xl border border-surface-container-high animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-36 bg-surface-container-high rounded-full" />
              <div className="h-3 w-24 bg-surface-container rounded-full" />
            </div>
            <div className="h-4 w-20 bg-surface-container-high rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
