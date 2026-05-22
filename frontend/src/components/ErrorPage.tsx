const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">Oops!</h1>
      <p className="text-lg text-slate-300 mb-6">
        Something went wrong while loading this page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Reload Page
      </button>
    </div>
  );
};

export default ErrorPage;