// Lucide icons used by the reference site (same paths and default attributes).
function Icon({ name, children, className, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`lucide lucide-${name} ${className ?? ''}`} {...rest}
    >
      {children}
    </svg>
  );
}

export const ChevronDown = (p) => <Icon name="chevron-down" {...p}><path d="m6 9 6 6 6-6" /></Icon>;
export const ChevronRight = (p) => <Icon name="chevron-right" {...p}><path d="m9 18 6-6-6-6" /></Icon>;
export const ArrowRight = (p) => <Icon name="arrow-right" {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;
export const Check = (p) => <Icon name="check" {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
export const X = (p) => <Icon name="x" {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>;
export const Menu = (p) => (
  <Icon name="menu" {...p}>
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
  </Icon>
);
export const MapPin = (p) => (
  <Icon name="map-pin" {...p}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
export const Phone = (p) => (
  <Icon name="phone" {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Icon>
);
