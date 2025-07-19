export function EcoRobotLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* 배경 원 */}
        <circle cx="60" cy="60" r="55" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeWidth="2"/>
        
        {/* 잎사귀 */}
        <path
          d="M40 45C40 35 48 25 60 25C72 25 80 35 80 45C80 55 72 50 60 50C48 50 40 55 40 45Z"
          fill="#22C55E"
        />
        <path
          d="M35 55C25 55 15 47 15 35C15 23 25 15 35 15C45 15 40 23 40 35C40 47 45 55 35 55Z"
          fill="#16A34A"
        />
        <path
          d="M85 55C95 55 105 47 105 35C105 23 95 15 85 15C75 15 80 23 80 35C80 47 75 55 85 55Z"
          fill="#16A34A"
        />
        
        {/* 로봇 몸체 - 크기 증가 */}
        <rect x="40" y="58" width="40" height="32" rx="6" fill="#374151"/>
        
        {/* 로봇 머리 - 크기 증가 */}
        <rect x="44" y="40" width="32" height="25" rx="4" fill="#4B5563"/>
        
        {/* 로봇 눈 - 크기 증가 */}
        <circle cx="52" cy="50" r="3" fill="#10B981"/>
        <circle cx="68" cy="50" r="3" fill="#10B981"/>
        
        {/* 로봇 팔 - 크기 증가 */}
        <rect x="32" y="65" width="8" height="18" rx="3" fill="#6B7280"/>
        <rect x="80" y="65" width="8" height="18" rx="3" fill="#6B7280"/>
        
        {/* 로봇 다리 - 크기 증가 */}
        <rect x="48" y="90" width="8" height="20" rx="3" fill="#6B7280"/>
        <rect x="64" y="90" width="8" height="20" rx="3" fill="#6B7280"/>
        
        {/* 로봇 안테나 */}
        <circle cx="54" cy="37" r="1.5" fill="#10B981"/>
        <circle cx="66" cy="37" r="1.5" fill="#10B981"/>
        <line x1="54" y1="37" x2="54" y2="32" stroke="#10B981" strokeWidth="2"/>
        <line x1="66" y1="37" x2="66" y2="32" stroke="#10B981" strokeWidth="2"/>
        
        {/* 환경 요소 - 작은 점들 */}
        <circle cx="25" cy="75" r="1.5" fill="#22C55E"/>
        <circle cx="95" cy="75" r="1.5" fill="#22C55E"/>
        <circle cx="30" cy="90" r="1" fill="#16A34A"/>
        <circle cx="90" cy="90" r="1" fill="#16A34A"/>
      </svg>
    </div>
  );
}