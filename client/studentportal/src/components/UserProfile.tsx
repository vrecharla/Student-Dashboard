import { useState } from "react";
import { User } from "lucide-react";

export default function UserProfile() {
  const [imgError, setImgError] = useState(false);

  const user = {
    name: "John Doe",
    role: "3rd year",
    avatar: "/assets/avatar.png",
  };

  return (
    <div className="flex items-center gap-3">
      {!imgError ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover shadow-md"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shadow-md">
          <User className="text-gray-600 w-5 h-5" />
        </div>
      )}

      <div className="text-left">
        <p className="text-sm font-semibold text-black">{user.name}</p>
        <p className="text-xs text-black/80">{user.role}</p>
      </div>
    </div>
  );
}
