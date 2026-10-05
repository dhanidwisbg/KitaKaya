export default function AdvisorLoading() {
  return (
    <div className="space-y-4 pt-2 max-w-3xl mx-auto">
      <div className="space-y-1.5">
        <div className="h-7 w-44 bg-surface-container-high rounded-xl animate-pulse" />
        <div className="h-4 w-72 bg-surface-container rounded-full animate-pulse" />
      </div>

      {/* Suggested prompts */}
      <div className="flex gap-2 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-36 bg-surface-container-high rounded-full animate-pulse" />
        ))}
      </div>

      {/* Chat bubbles */}
      <div className="space-y-4 py-4">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-surface-container-high shrink-0 animate-pulse" />
          <div className="flex-1 max-w-sm space-y-1.5">
            <div className="h-4 bg-surface-container-high rounded-2xl animate-pulse" />
            <div className="h-4 w-4/5 bg-surface-container-high rounded-2xl animate-pulse" />
            <div className="h-4 w-3/5 bg-surface-container rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="h-14 w-full bg-surface-container-high rounded-2xl animate-pulse mt-auto" />
    </div>
  );
}
