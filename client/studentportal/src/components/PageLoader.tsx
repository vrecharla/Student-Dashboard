export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent"
        ></div>

        <p className="mt-4 text-l font-semibold opacity-80">
          Loading ...
        </p>
      </div>
    </div>
  );
}
