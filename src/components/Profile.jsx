import React, { useState } from "react";
import EditProfile from "./EditProfile";
import UserCard from "./UserCard";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const location = useLocation();
  // allow opening edit form when navigated with state.openEdit === true
  const [isEditing, setIsEditing] = useState(
    Boolean(location?.state?.openEdit)
  );

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      {!isEditing ? (
        <div>
          <UserCard
            user={user}
            isProfile={true}
            onEdit={() => setIsEditing(true)}
          />
        </div>
      ) : (
        // Show preview and edit form side-by-side on md+ screens, stacked on small screens
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <UserCard
              user={user}
              isProfile={true}
              onEdit={() => setIsEditing(true)}
            />
          </div>
          <div>
            <EditProfile
              user={user}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
