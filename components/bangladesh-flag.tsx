"use client";

export function BangladeshFlag({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 120 80"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Green background */}
        <rect width="120" height="80" fill="#006A4E" />
        
        {/* Red circle */}
        <circle cx="48" cy="40" r="20" fill="#F42A41" />
      </svg>
    </div>
  );
}

