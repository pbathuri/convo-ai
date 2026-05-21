export function ScaffoldBanner({ feature }: { feature: string }) {
  return (
    <p className="rounded-md border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs text-amber-900 dark:text-amber-100">
      MVP scaffold — {feature} is not wired in this release. Use documented API
      flows only (see conversate/web README).
    </p>
  );
}
