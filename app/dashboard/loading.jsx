export default function DashboardLoading() {
  return (
    <div className="container-app section-app">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 space-y-3">
          <div className="skeleton-shimmer h-8 w-48" />
          <div className="skeleton-shimmer h-4 w-72" />
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface p-4">
              <div className="skeleton-shimmer mb-3 h-4 w-24" />
              <div className="skeleton-shimmer h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-surface p-4">
              <div className="skeleton-shimmer mb-3 h-32 w-full" />
              <div className="skeleton-shimmer mb-2 h-4 w-3/4" />
              <div className="skeleton-shimmer h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
