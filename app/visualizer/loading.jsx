export default function VisualizerLoading() {
  return (
    <div className="container-app section-app">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="skeleton-shimmer mx-auto h-12 w-full max-w-2xl" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-surface overflow-hidden">
              <div className="skeleton-shimmer h-40 w-full rounded-none" />
              <div className="space-y-2 p-4">
                <div className="skeleton-shimmer h-5 w-3/4" />
                <div className="skeleton-shimmer h-4 w-full" />
                <div className="skeleton-shimmer h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
