export function RouteLoadingShell() {
  return (
    <main
      className="flex flex-1 flex-col bg-bg-canvas text-text-primary"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="site-container flex flex-1 items-center justify-center py-24">
        <div
          className="size-8 rounded-full border-2 border-border-default border-t-action-primary motion-safe:animate-spin"
          role="presentation"
        />
      </div>
    </main>
  );
}
