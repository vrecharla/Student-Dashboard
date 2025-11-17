import { useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export type UserProfileProps = {
  name?: string;
  term?: string;
  role?: string;
  avatar?: string;
  sizeClass?: string;
  className?: string;
};

export default function UserProfile({
  name = "John Doe",
  term,
  role = undefined,
  avatar = "/assets/avatar.png",
  sizeClass = "w-10 h-10",
  className = "",
}: UserProfileProps) {
  const [imgError, setImgError] = useState(false);
  const displayTerm = term ?? "Spring 2024";

  return (
    <Link
      to="/profile"
      className={`flex items-center gap-3 cursor-pointer ${className}`.trim()}
    >
      {!imgError ? (
        <img
          src={avatar}
          alt={name}
          className={`${sizeClass} rounded-full object-cover shadow-md`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full bg-gray-300 flex items-center justify-center shadow-md`}
        >
          <User className="text-gray-600 w-5 h-5" />
        </div>
      )}

      <div className="text-left hidden md:block">
        <p className="text-sm font-semibold text-black">{name}</p>
        <p className="text-xs text-black/80">{displayTerm}</p>
      </div>
    </Link>
  );
}
