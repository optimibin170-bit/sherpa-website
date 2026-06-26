export const TopographyPattern = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="topo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#topo)" />
  </svg>
);

export const GridPattern = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

export const MountainSilhouette = () => (
  <svg
    className="pointer-events-none absolute bottom-0 left-0 w-full opacity-[0.04]"
    viewBox="0 0 1440 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M0 200L60 180L120 160L180 140L240 120L300 100L360 80L420 60L480 40L540 20L600 0L660 20L720 40L780 60L840 80L900 100L960 120L1020 140L1080 160L1140 180L1200 160L1260 140L1320 120L1380 100L1440 80V200H0Z"
      fill="currentColor"
    />
  </svg>
);

export const AbstractRings = () => (
  <svg
    className="pointer-events-none absolute -right-20 top-1/4 h-[500px] w-[500px] opacity-[0.03]"
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="250" cy="250" r="200" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="250" cy="250" r="80" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="250" cy="250" r="40" stroke="currentColor" strokeWidth="0.5" />
    <line x1="50" y1="250" x2="450" y2="250" stroke="currentColor" strokeWidth="0.3" />
    <line x1="250" y1="50" x2="250" y2="450" stroke="currentColor" strokeWidth="0.3" />
  </svg>
);

export const DotsPattern = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

export const WavyLines = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
    viewBox="0 0 1440 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M0 100C240 150 480 50 720 100C960 150 1200 50 1440 100"
      stroke="currentColor"
      strokeWidth="0.5"
    />
    <path
      d="M0 150C240 200 480 100 720 150C960 200 1200 100 1440 150"
      stroke="currentColor"
      strokeWidth="0.5"
    />
    <path
      d="M0 200C240 250 480 150 720 200C960 250 1200 150 1440 200"
      stroke="currentColor"
      strokeWidth="0.5"
    />
    <path
      d="M0 250C240 300 480 200 720 250C960 300 1200 200 1440 250"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </svg>
);

export const Mountain3D = () => (
  <svg
    className="animate-float3d h-[340px] w-[340px]"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Back mountain - darkest */}
    <path d="M200 60L320 280H80L200 60Z" fill="hsl(204 86% 38%)" opacity="0.25" />
    <path d="M200 60L320 280H200V60Z" fill="hsl(204 86% 38%)" opacity="0.15" />
    {/* Mid mountain */}
    <path d="M200 100L310 300H90L200 100Z" fill="hsl(188 79% 42%)" opacity="0.3" />
    <path d="M200 100L310 300H200V100Z" fill="hsl(188 79% 42%)" opacity="0.18" />
    {/* Front mountain - lightest */}
    <path d="M200 140L330 320H70L200 140Z" fill="hsl(145 69% 47%)" opacity="0.2" />
    <path d="M200 140L330 320H200V140Z" fill="hsl(145 69% 47%)" opacity="0.12" />
    {/* Snow caps */}
    <path d="M200 60L215 95L185 95L200 60Z" fill="white" opacity="0.5" />
    <path d="M200 100L218 135L182 135L200 100Z" fill="white" opacity="0.4" />
    {/* Grid lines for 3D depth */}
    <line x1="90" y1="300" x2="310" y2="300" stroke="hsl(188 79% 42%)" strokeWidth="0.5" opacity="0.15" />
    <line x1="110" y1="280" x2="290" y2="280" stroke="hsl(188 79% 42%)" strokeWidth="0.5" opacity="0.12" />
    <line x1="130" y1="260" x2="270" y2="260" stroke="hsl(188 79% 42%)" strokeWidth="0.5" opacity="0.1" />
    <line x1="150" y1="240" x2="250" y2="240" stroke="hsl(188 79% 42%)" strokeWidth="0.5" opacity="0.08" />
    {/* Small floating particles */}
    <circle cx="150" cy="200" r="2" fill="hsl(188 79% 42%)" opacity="0.2" />
    <circle cx="250" cy="180" r="1.5" fill="hsl(145 69% 47%)" opacity="0.2" />
    <circle cx="180" cy="160" r="1" fill="hsl(204 86% 38%)" opacity="0.25" />
  </svg>
);

export const IsometricCareer = () => (
  <svg
    className="animate-float3d h-[320px] w-[360px]"
    viewBox="0 0 400 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Base platform */}
    <path d="M200 320L340 260L200 200L60 260L200 320Z" fill="hsl(188 79% 42%)" opacity="0.08" />
    <path d="M200 320L340 260L340 275L200 335L60 275L60 260L200 320Z" fill="hsl(188 79% 42%)" opacity="0.05" />

    {/* Step 1 - Foundation */}
    <path d="M200 280L310 230L200 180L90 230L200 280Z" fill="hsl(188 79% 42%)" opacity="0.15" />
    <path d="M200 280L310 230L310 245L200 295L90 245L90 230L200 280Z" fill="hsl(188 79% 42%)" opacity="0.1" />
    <text x="200" y="255" textAnchor="middle" fill="hsl(204 86% 38%)" fontSize="10" fontWeight="600" opacity="0.4">FOUNDATION</text>

    {/* Step 2 - Growth */}
    <path d="M200 230L290 185L200 140L110 185L200 230Z" fill="hsl(145 69% 47%)" opacity="0.18" />
    <path d="M200 230L290 185L290 200L200 245L110 200L110 185L200 230Z" fill="hsl(145 69% 47%)" opacity="0.12" />
    <text x="200" y="205" textAnchor="middle" fill="hsl(145 69% 47%)" fontSize="10" fontWeight="600" opacity="0.4">GROWTH</text>

    {/* Step 3 - Leadership */}
    <path d="M200 180L270 140L200 100L130 140L200 180Z" fill="hsl(209 77% 52%)" opacity="0.22" />
    <path d="M200 180L270 140L270 155L200 195L130 155L130 140L200 180Z" fill="hsl(209 77% 52%)" opacity="0.14" />
    <text x="200" y="155" textAnchor="middle" fill="hsl(209 77% 52%)" fontSize="10" fontWeight="600" opacity="0.4">LEADERSHIP</text>

    {/* Step 4 - Summit */}
    <path d="M200 130L250 105L200 80L150 105L200 130Z" fill="hsl(6 91% 63%)" opacity="0.25" />
    <path d="M200 130L250 105L250 118L200 143L150 118L150 105L200 130Z" fill="hsl(6 91% 63%)" opacity="0.16" />
    <text x="200" y="118" textAnchor="middle" fill="hsl(6 91% 63%)" fontSize="9" fontWeight="700" opacity="0.5">SUMMIT</text>

    {/* Rising arrow */}
    <path d="M200 72L212 58L200 44L188 58L200 72Z" fill="hsl(145 69% 47%)" opacity="0.4" />
    <line x1="200" y1="72" x2="200" y2="44" stroke="hsl(145 69% 47%)" strokeWidth="2" opacity="0.3" />

    {/* Connection lines between steps */}
    <line x1="200" y1="130" x2="200" y2="180" stroke="hsl(188 79% 42%)" strokeWidth="1" opacity="0.12" strokeDasharray="4 4" />
    <line x1="200" y1="180" x2="200" y2="230" stroke="hsl(188 79% 42%)" strokeWidth="1" opacity="0.12" strokeDasharray="4 4" />
    <line x1="200" y1="230" x2="200" y2="280" stroke="hsl(188 79% 42%)" strokeWidth="1" opacity="0.12" strokeDasharray="4 4" />

    {/* Side decoration - left */}
    <circle cx="80" cy="200" r="3" fill="hsl(188 79% 42%)" opacity="0.2" />
    <circle cx="70" cy="180" r="2" fill="hsl(145 69% 47%)" opacity="0.2" />
    <circle cx="90" cy="160" r="1.5" fill="hsl(209 77% 52%)" opacity="0.2" />

    {/* Side decoration - right */}
    <circle cx="320" cy="200" r="3" fill="hsl(188 79% 42%)" opacity="0.2" />
    <circle cx="330" cy="180" r="2" fill="hsl(145 69% 47%)" opacity="0.2" />
    <circle cx="310" cy="160" r="1.5" fill="hsl(209 77% 52%)" opacity="0.2" />

    {/* Top sparkles */}
    <circle cx="175" cy="50" r="1.5" fill="hsl(145 69% 47%)" opacity="0.3" />
    <circle cx="225" cy="50" r="1.5" fill="hsl(6 91% 63%)" opacity="0.3" />
    <circle cx="200" cy="35" r="2" fill="hsl(145 69% 47%)" opacity="0.25" />
  </svg>
);

export const TestimonialVisual1 = () => (
  <div className="animate-slide-horizontal relative h-[220px] w-[280px]">
    <div
      className="absolute left-0 top-8 h-[150px] w-[190px] rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg"
      style={{ transform: "perspective(800px) rotateY(14deg) rotateX(-6deg)" }}
    />
    <div
      className="absolute left-10 top-3 h-[150px] w-[190px] rounded-xl border border-secondary/15 bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-xl"
      style={{ transform: "perspective(800px) rotateY(8deg) rotateX(-3deg)" }}
    />
    <div
      className="absolute left-20 top-0 h-[150px] w-[190px] rounded-xl border border-accent/15 bg-gradient-to-br from-accent/5 to-accent/10 shadow-2xl"
      style={{ transform: "perspective(800px) rotateY(3deg) rotateX(-1deg)" }}
    />
    <span className="absolute left-28 top-10 font-display text-[3.5rem] leading-none text-primary/20">&quot;</span>
    <svg className="absolute -right-4 bottom-4 h-16 w-16 opacity-20" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="25" stroke="hsl(188 79% 42%)" strokeWidth="1" />
      <circle cx="30" cy="30" r="18" stroke="hsl(145 69% 47%)" strokeWidth="0.8" />
      <circle cx="30" cy="30" r="11" stroke="hsl(209 77% 52%)" strokeWidth="0.6" />
    </svg>
  </div>
);

export const TestimonialVisual2 = () => (
  <div className="relative h-[220px] w-[280px]">
    <svg className="animate-float3d h-full w-full" viewBox="0 0 280 220" fill="none">
      <path d="M140 40L220 80L140 120L60 80L140 40Z" fill="hsl(188 79% 42%)" opacity="0.08" />
      <path d="M140 80L220 120L140 160L60 120L140 80Z" fill="hsl(145 69% 47%)" opacity="0.1" />
      <path d="M140 120L220 160L140 200L60 160L140 120Z" fill="hsl(209 77% 52%)" opacity="0.12" />
      <line x1="140" y1="40" x2="140" y2="200" stroke="hsl(188 79% 42%)" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      <line x1="60" y1="80" x2="220" y2="160" stroke="hsl(145 69% 47%)" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 4" />
      <line x1="220" y1="80" x2="60" y2="160" stroke="hsl(209 77% 52%)" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 4" />
      <circle cx="140" cy="80" r="4" fill="hsl(188 79% 42%)" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 140 120" to="360 140 120" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="220" cy="120" r="3" fill="hsl(145 69% 47%)" opacity="0.25">
        <animateTransform attributeName="transform" type="rotate" from="0 140 120" to="-360 140 120" dur="12s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="120" r="3.5" fill="hsl(209 77% 52%)" opacity="0.2">
        <animateTransform attributeName="transform" type="rotate" from="0 140 120" to="360 140 120" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="120" r="15" fill="hsl(188 79% 42%)" opacity="0.06" />
      <circle cx="140" cy="120" r="8" fill="hsl(188 79% 42%)" opacity="0.1" />
    </svg>
  </div>
);

export const TestimonialVisual3 = () => (
  <div className="relative h-[220px] w-[280px]">
    <svg className="animate-float3d h-full w-full" viewBox="0 0 280 220" fill="none">
      <path d="M100 60L180 60L180 140L100 140Z" stroke="hsl(188 79% 42%)" strokeWidth="0.8" opacity="0.12" fill="hsl(188 79% 42%)" fillOpacity="0.03" />
      <path d="M80 80L160 80L160 160L80 160Z" stroke="hsl(145 69% 47%)" strokeWidth="1" opacity="0.2" fill="hsl(145 69% 47%)" fillOpacity="0.04" />
      <line x1="100" y1="60" x2="80" y2="80" stroke="hsl(209 77% 52%)" strokeWidth="0.8" opacity="0.15" />
      <line x1="180" y1="60" x2="160" y2="80" stroke="hsl(209 77% 52%)" strokeWidth="0.8" opacity="0.15" />
      <line x1="180" y1="140" x2="160" y2="160" stroke="hsl(209 77% 52%)" strokeWidth="0.8" opacity="0.15" />
      <line x1="100" y1="140" x2="80" y2="160" stroke="hsl(209 77% 52%)" strokeWidth="0.8" opacity="0.15" />
      <circle cx="120" cy="100" r="2.5" fill="hsl(6 91% 63%)" opacity="0.3" />
      <circle cx="140" cy="120" r="3" fill="hsl(188 79% 42%)" opacity="0.35" />
      <circle cx="110" cy="130" r="2" fill="hsl(145 69% 47%)" opacity="0.25" />
      <circle cx="150" cy="95" r="2" fill="hsl(209 77% 52%)" opacity="0.25" />
      <ellipse cx="140" cy="120" rx="60" ry="30" stroke="hsl(188 79% 42%)" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3">
        <animateTransform attributeName="transform" type="rotate" from="0 140 120" to="360 140 120" dur="15s" repeatCount="indefinite" />
      </ellipse>
      <text x="140" y="125" textAnchor="middle" fill="hsl(188 79% 42%)" fontSize="14" fontWeight="600" opacity="0.15">SSA</text>
    </svg>
  </div>
);

export const NepalSilhouette = () => (
  <svg
    className="h-[180px] w-[220px] opacity-20"
    viewBox="0 0 260 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Simplified Nepal map outline */}
    <path
      d="M20 120L40 100L60 110L80 90L100 95L120 80L140 85L160 70L180 75L200 60L220 65L240 50L250 55L245 70L230 85L210 95L190 100L170 110L150 115L130 120L110 130L90 135L70 140L50 145L30 150L20 140Z"
      fill="hsl(204 86% 38%)"
      opacity="0.3"
    />
    {/* Mountain peaks inside Nepal */}
    <path d="M100 100L120 70L140 100Z" fill="hsl(188 79% 42%)" opacity="0.2" />
    <path d="M140 95L155 65L170 95Z" fill="hsl(145 69% 47%)" opacity="0.18" />
    <path d="M170 90L185 55L200 90Z" fill="hsl(188 79% 42%)" opacity="0.15" />
    {/* Kathmandu dot */}
    <circle cx="150" cy="85" r="4" fill="hsl(6 91% 63%)" opacity="0.4" />
    <circle cx="150" cy="85" r="7" fill="none" stroke="hsl(6 91% 63%)" strokeWidth="1" opacity="0.2" />
  </svg>
);

export const IsometricOffice = () => (
  <svg
    className="animate-float3d h-[200px] w-[240px]"
    viewBox="0 0 280 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Isometric desk */}
    <path d="M140 180L240 140L140 100L40 140L140 180Z" fill="hsl(188 79% 42%)" opacity="0.1" />
    <path d="M140 180L240 140L240 155L140 195L40 155L40 140L140 180Z" fill="hsl(188 79% 42%)" opacity="0.06" />
    {/* Monitor */}
    <rect x="105" y="85" width="70" height="45" rx="3" fill="hsl(204 86% 38%)" opacity="0.15" />
    <rect x="108" y="88" width="64" height="39" rx="2" fill="hsl(184 60% 97%)" opacity="0.3" />
    {/* Screen content - chart bars */}
    <rect x="115" y="110" width="6" height="12" fill="hsl(145 69% 47%)" opacity="0.25" />
    <rect x="124" y="105" width="6" height="17" fill="hsl(188 79% 42%)" opacity="0.25" />
    <rect x="133" y="108" width="6" height="14" fill="hsl(209 77% 52%)" opacity="0.25" />
    <rect x="142" y="100" width="6" height="22" fill="hsl(145 69% 47%)" opacity="0.25" />
    <rect x="151" y="103" width="6" height="19" fill="hsl(188 79% 42%)" opacity="0.25" />
    {/* Monitor stand */}
    <rect x="135" y="130" width="10" height="10" fill="hsl(204 86% 38%)" opacity="0.12" />
    {/* Coffee cup */}
    <ellipse cx="200" cy="135" rx="8" ry="4" fill="hsl(204 86% 38%)" opacity="0.15" />
    <rect x="193" y="130" width="14" height="8" rx="2" fill="hsl(204 86% 38%)" opacity="0.12" />
    {/* Plant */}
    <rect x="60" y="128" width="10" height="12" rx="2" fill="hsl(145 69% 47%)" opacity="0.15" />
    <circle cx="65" cy="122" r="8" fill="hsl(145 69% 47%)" opacity="0.12" />
    {/* Floating particles */}
    <circle cx="170" cy="75" r="1.5" fill="hsl(188 79% 42%)" opacity="0.2" />
    <circle cx="100" cy="80" r="1" fill="hsl(145 69% 47%)" opacity="0.2" />
  </svg>
);
