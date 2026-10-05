export default function GoalsLoading() {
  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <div className="h-7 w-40 bg-surface-container-high rounded-xl animate-pulse" />
          <div className="h-4 w-56 bg-surface-container rounded-full animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-surface-container-high rounded-full animate-pulse" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-surface-container-high rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 bg-surface-container-lowest rounded-3xl border border-surface-container-high space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-28 bg-surface-container-high rounded-full" />
                <div className="h-3 w-20 bg-surface-container rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-surface-container-high rounded-full" />
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-surface-container rounded-full" />
                <div className="h-3 w-16 bg-surface-container-high rounded-full" />
              </div>
            </div>
            <div className="h-10 w-full bg-surface-container-high rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
