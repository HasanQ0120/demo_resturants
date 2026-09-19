type IconProps = { className?: string };

export function CheckIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function FlameIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.5 1.5c.5 3-1 4.7-2.6 6.4C8.2 9.7 6.5 11.6 6.5 15a5.5 5.5 0 0 0 11 0c0-1.7-.6-2.9-1.3-4-.3.9-.9 1.7-1.7 1.7-1 0-1.5-.8-1.2-1.8.6-2 .4-4.4-.8-9.4zM12 20.5a3 3 0 0 1-3-3c0-1.3.6-2 1.3-2.8.2.7.8 1.2 1.5 1.2.9 0 1.4-.8 1.1-1.7-.2-.6-.1-1.2.2-1.7.9.9 1.9 2.1 1.9 3.5a3 3 0 0 1-3 3.5z" />
    </svg>
  );
}

export function BikeIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5 9 10h6l3.5 7.5M9 10l2-3.5h3M13 10l3 3" />
      <path d="M9 10H6" />
    </svg>
  );
}
