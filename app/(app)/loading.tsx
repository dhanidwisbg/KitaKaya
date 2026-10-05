export default function AppLoading() {
  return (
    <div className="flex flex-col w-full pb-16 space-y-6 animate-pulse pt-2">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-surface-container-high rounded-full" />
          <div className="h-8 w-56 bg-surface-container-high rounded-xl" />
        </div>
        <div className="h-8 w-32 bg-surface-container-high rounded-full" />
      </div>

      {/* Hero card skeleton */}
      <div className="h-52 w-full bg-surface-container-high rounded-3xl" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-28 bg-surface-container-high rounded-2xl" />
        <div className="h-28 bg-surface-container-high rounded-2xl" />
        <div className="h-28 bg-surface-container-high rounded-2xl" />
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-56 bg-surface-container-high rounded-2xl" />
        <div className="h-56 bg-surface-container-high rounded-2xl" />
      </div>

      {/* List rows */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-container-high rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
