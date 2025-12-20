export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Architectural mark: stylized building/tower shape */}
      {/* Main vertical rectangle (building body) */}
      <rect x="16" y="12" width="32" height="40" stroke="currentColor" strokeWidth="2" />

      {/* Horizontal dividing lines (floors) */}
      <line x1="16" y1="22" x2="48" y2="22" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="32" x2="48" y2="32" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="42" x2="48" y2="42" stroke="currentColor" strokeWidth="1.5" />

      {/* Windows (3x3 grid) */}
      <rect x="20" y="15" width="4" height="4" fill="currentColor" />
      <rect x="30" y="15" width="4" height="4" fill="currentColor" />
      <rect x="40" y="15" width="4" height="4" fill="currentColor" />

      <rect x="20" y="25" width="4" height="4" fill="currentColor" opacity="0.7" />
      <rect x="30" y="25" width="4" height="4" fill="currentColor" opacity="0.7" />
      <rect x="40" y="25" width="4" height="4" fill="currentColor" opacity="0.7" />

      <rect x="20" y="35" width="4" height="4" fill="currentColor" opacity="0.5" />
      <rect x="30" y="35" width="4" height="4" fill="currentColor" opacity="0.5" />
      <rect x="40" y="35" width="4" height="4" fill="currentColor" opacity="0.5" />

      {/* Roof peak (triangle on top) */}
      <path d="M 16 12 L 32 4 L 48 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />

      {/* Foundation line */}
      <line x1="14" y1="54" x2="50" y2="54" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
