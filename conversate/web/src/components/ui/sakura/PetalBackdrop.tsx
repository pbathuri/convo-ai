export function PetalBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden sakura-theme"
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: "var(--sakura-gradient-hero)" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="petal-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="12" r="2" fill="var(--sakura-petal-300)" opacity="0.5" />
            <ellipse cx="32" cy="28" rx="3" ry="1.5" fill="var(--sakura-petal-500)" opacity="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#petal-dots)" />
      </svg>
      <div className="absolute inset-0">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="sakura-petal absolute block h-3 w-4 rounded-full bg-[var(--sakura-petal-300)] opacity-40"
            style={{
              left: `${12 + i * 14}%`,
              top: `${8 + (i % 3) * 22}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
