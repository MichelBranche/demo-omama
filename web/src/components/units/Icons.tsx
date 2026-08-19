export function ArrowCorner({ fill = "black" }: { fill?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
      <path
        d="M7.17418 1.66471L0.574525 1.66471L0.589256 6.74452e-05L10.0173 6.90346e-05L10.0173 9.42815L8.3527 9.44288L8.3527 2.84322L1.17851 10.0174L3.1533e-06 8.8389L7.17418 1.66471Z"
        fill={fill}
      />
    </svg>
  );
}

export function CtaArrow({ fill = "white" }: { fill?: string }) {
  return (
    <svg className="arrow" width="18" height="17" viewBox="0 0 18 17" fill="none" aria-hidden>
      <path
        d="M10.8705 6.45402L4.27087 6.45402L4.2856 4.78937L13.7137 4.78937L13.7137 14.2175L12.049 14.2322L12.049 7.63253L4.87486 14.8067L3.69634 13.6282L10.8705 6.45402Z"
        fill={fill}
      />
    </svg>
  );
}

export function ShapeOverlays() {
  return (
    <svg className="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <path className="shape-overlays__path _1" d="M0 0 H100 V100 H0 Z" fill="#FFB200" />
      <path className="shape-overlays__path _2" d="M0 0 H100 V100 H0 Z" fill="#E6313A" />
      <path className="shape-overlays__path _3" d="M0 0 H100 V100 H0 Z" fill="#267E6E" />
    </svg>
  );
}

export function Bolt({ fill = "#FFDB08" }: { fill?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M8.25 11.25H4.5L9.75 0.75V6.75H13.5L8.25 17.25V11.25Z" fill={fill} />
    </svg>
  );
}

export function Diamond({ fill = "#FFDB08" }: { fill?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="8.498" y="3.343" width="8" height="8" transform="rotate(44.7846 8.498 3.343)" fill={fill} />
    </svg>
  );
}

export function ArrowsHeaderLeft() {
  return (
    <svg width="58" height="42" viewBox="0 0 58 42" fill="none" aria-hidden>
      <g className="arrow-group">
        <path d="M13.7907 1.87317V38.8797" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25.7493 25.1344L13.791 39.937L1.83266 25.1344" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="arrow-group _2">
        <path d="M47.0029 6.50269V34.556" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M56.0442 24.1362L47.0026 35.3576L37.9609 24.1362" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function ArrowsHeaderRight() {
  return (
    <svg width="59" height="50" viewBox="0 0 59 50" fill="none" aria-hidden>
      <g className="arrow-group">
        <path d="M45.4573 1.34106V46.9771" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M57.4174 30.0265L45.4591 48.2809L33.5007 30.0265" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="arrow-group _2">
        <path d="M15.5 13.8773V41.3337" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24.5404 31.1356L15.4987 42.1182L6.45703 31.1356" stroke="#FFB200" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function IconPeople() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden>
      <circle cx="38" cy="32" r="12" fill="none" stroke="#000" strokeWidth="4" />
      <circle cx="64" cy="36" r="10" fill="none" stroke="#000" strokeWidth="4" />
      <path d="M16 82c2-18 12-28 22-28s20 10 22 28" fill="none" stroke="#000" strokeWidth="4" />
      <path d="M54 82c1-14 8-22 16-22s16 8 18 22" fill="none" stroke="#000" strokeWidth="4" />
    </svg>
  );
}

export function IconPencil() {
  return (
    <svg viewBox="0 0 100 80" width="100" height="80" aria-hidden>
      <path d="M18 62 L62 18 L78 34 L34 78 L18 78 Z" fill="none" stroke="#000" strokeWidth="4" />
      <path d="M54 26 L70 42" stroke="#000" strokeWidth="4" />
    </svg>
  );
}

export function IconHeart() {
  return (
    <svg viewBox="0 0 100 80" width="100" height="80" aria-hidden>
      <path
        d="M50 72 C20 50 12 32 28 20 C38 12 48 18 50 26 C52 18 62 12 72 20 C88 32 80 50 50 72Z"
        fill="none"
        stroke="#000"
        strokeWidth="4"
      />
    </svg>
  );
}
