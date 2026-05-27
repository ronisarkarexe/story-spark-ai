export default function BlogsLoading() {
  return (
    <div className="container-app section-app">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 space-y-4 text-center">
          <div className="skeleton-shimmer mx-auto h-10 w-64" />
          <div className="skeleton-shimmer mx-auto h-5 w-96" />
        </div>
        <div className="mb-12 grid gap-6 lg:grid-cols-12">
          <div className="card-surface overflow-hidden lg:col-span-7">
            <div className="skeleton-shimmer h-64 w-full rounded-none" />
            <div className="space-y-2 p-6">
              <div className="skeleton-shimmer h-4 w-20" />
              <div className="skeleton-shimmer h-6 w-3/4" />
              <div className="skeleton-shimmer h-4 w-full" />
            </div>
          </div>
          <div className="hidden space-y-4 lg:col-span-5 lg:block">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-surface flex gap-4 p-4">
                <div className="skeleton-shimmer h-20 w-24 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton-shimmer h-4 w-3/4" />
                  <div className="skeleton-shimmer h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface overflow-hidden">
              <div className="skeleton-shimmer h-48 w-full rounded-none" />
              <div className="space-y-2 p-4">
                <div className="skeleton-shimmer h-4 w-16" />
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
