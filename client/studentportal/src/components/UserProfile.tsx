import { useState } from "react";
import { User } from "lucide-react";

export type UserProfileProps = {
  name?: string;
  role?: string;
  avatar?: string;
  /** Tailwind size classes for the avatar (e.g. "w-10 h-10") */
  sizeClass?: string;
  /** Additional classes for the root container */
  className?: string;
};

/**
 * UserProfile component — configurable via props with sensible defaults so
 * existing usages don't need to change.
 */
export default function UserProfile({
  name = "John Doe",
  role = "3rd year",
  avatar = "/assets/avatar.png",
  sizeClass = "w-10 h-10",
  className = "",
}: UserProfileProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      {!imgError ? (
        <img
          src={avatar}
          alt={name}
          className={`${sizeClass} rounded-full object-cover shadow-md`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`${sizeClass} rounded-full bg-gray-300 flex items-center justify-center shadow-md`}>
          <User className="text-gray-600 w-5 h-5" />
        </div>
      )}

      <div className="text-left">
        <p className="text-sm font-semibold text-black">{name}</p>
        <p className="text-xs text-black/80">{role}</p>
      </div>
    </div>
  );
}
