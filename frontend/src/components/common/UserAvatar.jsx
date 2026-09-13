import React, { useState } from 'react';

/**
 * Modern user avatar component that strictly renders the user's uploaded photo,
 * or beautiful initials with a gradient background when no photo is uploaded.
 * Completely avoids random/placeholder stock images.
 */
export const UserAvatar = ({
  user,
  name,
  profileImage,
  size = 'md',
  className = '',
  showRoleBadge = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const displayName = user?.name || name || 'Traveler';
  const imageUrl = user?.profileImage || profileImage;

  // Extract up to 2 initials
  const getInitials = (str) => {
    if (!str) return 'TM';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(displayName);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-14 h-14 text-lg font-bold',
    xl: 'w-20 h-20 text-2xl font-black',
    '2xl': 'w-24 h-24 text-3xl font-black',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  const hasValidImage = imageUrl && !imageError && typeof imageUrl === 'string' && imageUrl.trim().length > 0;

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {hasValidImage ? (
        <img
          src={imageUrl}
          alt={displayName}
          onError={() => setImageError(true)}
          className={`${selectedSize} rounded-full object-cover ring-2 ring-purple-500/20 shadow-sm`}
        />
      ) : (
        <div
          className={`${selectedSize} rounded-full bg-gradient-to-tr from-[#6C3DF5] to-[#2563EB] text-white flex items-center justify-center font-bold tracking-wider shadow-sm ring-2 ring-purple-500/20 select-none`}
        >
          {initials}
        </div>
      )}

      {showRoleBadge && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
          title="Active Authenticated"
        />
      )}
    </div>
  );
};

export default UserAvatar;
