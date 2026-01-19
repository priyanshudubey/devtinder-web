import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const UserCard = ({ user, isProfile = false, onEdit }) => {
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const [success, setSuccess] = useState("");

  // If user is missing or empty, show a friendly placeholder
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="max-w-lg mx-auto my-4 p-4 text-center text-sm text-base-content/70">
        No user data available
      </div>
    );
  }

  const { firstName, lastName, photoURL, skills, about, gender, age } = user;

  const handleSendRequest = async (status) => {
    if (!user || !user._id) return;
    const toId = String(user._id);
    setProcessing(true);
    setErr("");
    try {
      const url = `${BASE_URL}request/send/${status}/${toId}`;
      await axios.post(url, {}, { withCredentials: true });
      // On success remove this user from feed so it no longer shows
      dispatch(removeUser(toId));
      setSuccess(
        status === "interested" ? "Connection request sent" : "User ignored"
      );
      setTimeout(() => setSuccess(""), 1800);
    } catch (e) {
      setErr(e?.message || "Failed to send request");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="card card-side bg-base-200 shadow-lg max-w-lg mx-auto my-4">
        <figure className="w-1/3 shrink-0">
          <img
            src={photoURL}
            alt={firstName}
            className="w-full h-full object-cover"
          />
        </figure>

        <div className="card-body p-4 md:p-6">
          <h2 className="card-title flex items-center gap-2">
            {firstName + " " + lastName}
            {user.membershipType && user.membershipType !== "Free" && (
              <RiVerifiedBadgeFill
                className="w-5 h-5 text-blue-500"
                title={user.membershipType}
              />
            )}
          </h2>
          <p className="text-sm text-base-content/80">{about}</p>
          <div className="mt-4 text-sm text-base-content/70 space-y-1">
            {age && (
              <p>
                <strong>Age:</strong> {age}
              </p>
            )}
            {gender && (
              <p>
                <strong>Gender:</strong> {gender}
              </p>
            )}
          </div>
          {skills && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase text-base-content/50 mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills && (
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="badge badge-secondary badge-outline">
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="card-actions justify-end mt-4">
            {isProfile ? (
              <button
                className="btn bg-purple-900 hover:bg-purple-700 btn-sm"
                onClick={onEdit}>
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleSendRequest("ignored")}
                  disabled={processing}>
                  {processing ? "..." : "Ignore"}
                </button>
                <button
                  className="btn bg-purple-900 hover:bg-purple-700 btn-sm"
                  onClick={() => handleSendRequest("interested")}
                  disabled={processing}>
                  {processing ? "..." : "Interested"}
                </button>
              </>
            )}
          </div>
          {err && <div className="text-sm text-red-600 mt-2">{err}</div>}
        </div>
      </div>
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50">
        {success && (
          <div className="toast">
            <div className="alert alert-success shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m1 4a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
