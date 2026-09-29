export function HeroNetwork() {
  return (
    <svg
      className="hero-network h-full w-full"
      viewBox="0 0 640 520"
      role="img"
      aria-label="Abstract network connecting clinical, financial, and technology nodes"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0B1F3A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="520" fill="url(#glow)" />
      <g stroke="#C9A227" strokeOpacity="0.35" fill="none">
        <line x1="120" y1="260" x2="320" y2="120" />
        <line x1="320" y1="120" x2="520" y2="220" />
        <line x1="520" y1="220" x2="430" y2="390" />
        <line x1="430" y1="390" x2="190" y2="400" />
        <line x1="190" y1="400" x2="120" y2="260" />
        <line x1="320" y1="120" x2="320" y2="300" />
        <line x1="120" y1="260" x2="320" y2="300" />
        <line x1="520" y1="220" x2="320" y2="300" />
      </g>
      {[
        [120, 260, 0],
        [320, 120, 0.6],
        [520, 220, 1.2],
        [430, 390, 1.8],
        [190, 400, 2.4],
        [320, 300, 0.3],
      ].map(([x, y, delay], i) => (
        <g key={i}>
          <circle
            className="network-node"
            cx={x}
            cy={y}
            r="7"
            fill="#C9A227"
            style={{ animationDelay: `${delay}s` }}
          />
          <circle
            cx={x}
            cy={y}
            r="16"
            fill="none"
            stroke="#C9A227"
            strokeOpacity="0.25"
          />
        </g>
      ))}
    </svg>
  );
}
