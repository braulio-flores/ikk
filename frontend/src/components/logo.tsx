// Logo IKK Solutions — símbolo + wordmark según design-reference/brand.jsx.
// La doble K refleja la K alrededor del eje vertical.

import { cn } from "@/lib/utils";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  size?: number;
}

export function IkkLogo({ showWordmark = true, className, size = 28 }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <IkkMark size={size} />
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          IKK Solutions
        </span>
      )}
    </div>
  );
}

export function IkkMark({ size = 28 }: { size?: number }) {
  // Símbolo: I + K + K espejada, en un cuadrado.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="IKK"
    >
      <rect
        x="0"
        y="0"
        width="32"
        height="32"
        rx="6"
        fill="var(--ikk-accent)"
      />
      <g
        stroke="var(--ikk-accent-fg)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      >
        {/* I */}
        <line x1="7" y1="8" x2="7" y2="24" />
        {/* K1 */}
        <line x1="13" y1="8" x2="13" y2="24" />
        <line x1="13" y1="16" x2="19" y2="10" />
        <line x1="13" y1="16" x2="19" y2="22" />
        {/* K espejada */}
        <line x1="25" y1="8" x2="25" y2="24" />
        <line x1="25" y1="16" x2="19" y2="10" />
        <line x1="25" y1="16" x2="19" y2="22" />
      </g>
    </svg>
  );
}
