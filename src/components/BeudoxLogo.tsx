interface BeudoxLogoProps {
  variant?: 'default' | 'sidebar';
  showWordmark?: boolean;
  size?: number;
}

const BeudoxLogo = ({ variant = 'default', showWordmark = true, size = 44 }: BeudoxLogoProps) => {
  const isDark = variant === 'sidebar';
  const markFill = isDark ? 'rgba(255,255,255,0.20)' : '#5B3FF8';
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width={size} height={size} rx={12} fill={markFill} />
        <g transform={`translate(${cx}, ${cy})`}>
          <rect x={-10} y={-10} width={20} height={20} rx={2} transform="rotate(15)" fill="rgba(255,255,255,0.25)" />
          <rect x={-6} y={-6} width={12} height={12} rx={2} transform="rotate(-10)" fill="rgba(255,255,255,0.90)" />
        </g>
      </svg>
      {showWordmark && (
        <span
          className="text-xl font-[800] tracking-[-0.03em]"
          style={{ fontFamily: "var(--ff-display)" }}
        >
          <span style={{ color: isDark ? '#FFFFFF' : '#120E36' }}>Beu</span>
          <span style={{ color: isDark ? '#7B62FA' : '#5B3FF8' }}>dox</span>
        </span>
      )}
    </div>
  );
};

export default BeudoxLogo;
