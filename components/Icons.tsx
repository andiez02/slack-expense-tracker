import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const DashboardIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v4" />
  </svg>
);

export const CreateIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export const HistoryIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const SettingsIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const MenuIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ArrowLeftIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const CheckIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const ClockIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CurrencyIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

export const DocumentIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const UsersIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path opacity="0.4" d="M17.5291 7.77C17.4591 7.76 17.3891 7.76 17.3191 7.77C15.7691 7.72 14.5391 6.45 14.5391 4.89C14.5391 3.3 15.8291 2 17.4291 2C19.0191 2 20.3191 3.29 20.3191 4.89C20.3091 6.45 19.0791 7.72 17.5291 7.77Z" fill="#292D32" />
    <path opacity="0.4" d="M20.7896 14.6999C19.6696 15.4499 18.0996 15.7299 16.6496 15.5399C17.0296 14.7199 17.2296 13.8099 17.2396 12.8499C17.2396 11.8499 17.0196 10.8999 16.5996 10.0699C18.0796 9.86992 19.6496 10.1499 20.7796 10.8999C22.3596 11.9399 22.3596 13.6499 20.7896 14.6999Z" fill="#292D32" />
    <path opacity="0.4" d="M6.44039 7.77C6.51039 7.76 6.58039 7.76 6.65039 7.77C8.20039 7.72 9.43039 6.45 9.43039 4.89C9.43039 3.3 8.14039 2 6.54039 2C4.95039 2 3.65039 3.29 3.65039 4.89C3.66039 6.45 4.89039 7.72 6.44039 7.77Z" fill="#292D32" />
    <path opacity="0.4" d="M6.54914 12.8501C6.54914 13.8201 6.75914 14.7401 7.13914 15.5701C5.72914 15.7201 4.25914 15.4201 3.17914 14.7101C1.59914 13.6601 1.59914 11.9501 3.17914 10.9001C4.24914 10.1801 5.75914 9.8901 7.17914 10.0501C6.76914 10.8901 6.54914 11.8401 6.54914 12.8501Z" fill="#292D32" />
    <path d="M12.1208 15.87C12.0408 15.86 11.9508 15.86 11.8608 15.87C10.0208 15.81 8.55078 14.3 8.55078 12.44C8.55078 10.54 10.0808 9 11.9908 9C13.8908 9 15.4308 10.54 15.4308 12.44C15.4308 14.3 13.9708 15.81 12.1208 15.87Z" fill="#292D32" />
    <path d="M8.87078 17.9399C7.36078 18.9499 7.36078 20.6099 8.87078 21.6099C10.5908 22.7599 13.4108 22.7599 15.1308 21.6099C16.6408 20.5999 16.6408 18.9399 15.1308 17.9399C13.4208 16.7899 10.6008 16.7899 8.87078 17.9399Z" fill="#292D32" />
  </svg>
);

export const EyeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const BellIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const LinkIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export const ColorSwatchIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
  </svg>
);

export const SpinnerIcon = ({ className = "w-5 h-5 animate-spin", size }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" width={size} height={size}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const TrendingUpIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const BanknotesIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const UserIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Company Logo - 4 colored blocks
export function CompanyLogo({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {/* Top left - Blue */}
      <rect x="2" y="2" width="9" height="9" rx="2" fill="#3B82F6" />
      {/* Top right - Green */}
      <rect x="13" y="2" width="9" height="9" rx="2" fill="#10B981" />
      {/* Bottom left - Red */}
      <rect x="2" y="13" width="9" height="9" rx="2" fill="#EF4444" />
      {/* Bottom right - Yellow */}
      <rect x="13" y="13" width="9" height="9" rx="2" fill="#F59E0B" />
    </svg>
  );
}

export const SlackIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    className={className}
    width={size || "20"}
    height={size || "20"}
    viewBox="0 0 512 512" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path 
        d="M122.643,316.682c0,26.596-21.727,48.323-48.321,48.323c-26.593,0-48.319-21.728-48.319-48.323c0-26.592,21.727-48.318,48.319-48.318h48.321V316.682z" 
        fill="#E01E5A" 
      />
      <path 
        d="M146.996,316.682c0-26.592,21.728-48.318,48.321-48.318c26.593,0,48.32,21.727,48.32,48.318V437.68c0,26.592-21.728,48.319-48.32,48.319c-26.594,0-48.321-21.728-48.321-48.319V316.682z" 
        fill="#E01E5A" 
      />
      <path 
        d="M195.317,122.643c-26.594,0-48.321-21.728-48.321-48.321c0-26.593,21.728-48.32,48.321-48.32c26.593,0,48.32,21.728,48.32,48.32v48.321H195.317L195.317,122.643z" 
        fill="#36C5F0" 
      />
      <path 
        d="M195.317,146.997c26.593,0,48.32,21.727,48.32,48.321c0,26.593-21.728,48.318-48.32,48.318H74.321c-26.593,0-48.319-21.726-48.319-48.318c0-26.595,21.727-48.321,48.319-48.321H195.317L195.317,146.997z" 
        fill="#36C5F0" 
      />
      <path 
        d="M389.359,195.318c0-26.595,21.725-48.321,48.32-48.321c26.593,0,48.318,21.727,48.318,48.321c0,26.593-21.726,48.318-48.318,48.318h-48.32V195.318L389.359,195.318z" 
        fill="#2EB67D" 
      />
      <path 
        d="M365.004,195.318c0,26.593-21.728,48.318-48.321,48.318c-26.593,0-48.32-21.726-48.32-48.318V74.321c0-26.593,21.728-48.32,48.32-48.32c26.594,0,48.321,21.728,48.321,48.32V195.318L365.004,195.318z" 
        fill="#2EB67D" 
      />
      <path 
        d="M316.683,389.358c26.594,0,48.321,21.727,48.321,48.321c0,26.592-21.728,48.319-48.321,48.319c-26.593,0-48.32-21.728-48.32-48.319v-48.321H316.683z" 
        fill="#ECB22E" 
      />
      <path 
        d="M316.683,365.005c-26.593,0-48.32-21.728-48.32-48.323c0-26.592,21.728-48.318,48.32-48.318H437.68c26.593,0,48.318,21.727,48.318,48.318c0,26.596-21.726,48.323-48.318,48.323H316.683z" 
        fill="#ECB22E" 
      />
    </g>
  </svg>
);