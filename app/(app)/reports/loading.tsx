export default function ReportsLoading() {
  return (
    <div className="space-y-6 pt-2">
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <div className="h-7 w-48 bg-surface-container-high rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-surface-container rounded-full animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-surface-container-high rounded-xl animate-pulse" />
          <div className="h-10 w-28 bg-surface-container-high rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Report preview */}
      <div className="h-96 w-full bg-surface-container-high rounded-3xl animate-pulse" />

      {/* Config panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-surface-container-high rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
