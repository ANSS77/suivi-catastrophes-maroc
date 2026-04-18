export default function LogoIcon({ className = "", textClassName = "text-3xl", size = 32, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ color: color !== 'currentColor' ? color : undefined }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="2.5" />
        <path d="M7.5 8 A 6 6 0 0 0 7.5 16" />
        <path d="M16.5 8 A 6 6 0 0 1 16.5 16" />
        <path d="M4.8 5 A 10 10 0 0 0 4.8 19" />
        <path d="M19.2 5 A 10 10 0 0 1 19.2 19" />
      </svg>
      <span className={`font-['EB_Garamond'] font-medium tracking-wide ${textClassName}`}>
        DisasterTrack
      </span>
    </div>
  );
}
