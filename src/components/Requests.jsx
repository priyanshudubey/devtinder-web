import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestsSlice";

// Truncate text to a given number of words and append ellipsis if truncated
function truncateWords(text, limit = 60) {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
}

// Parse several possible date shapes returned from the backend
function parseDate(value) {
  if (!value) return null;
  if (typeof value === "object") {
    if (value.$date) return new Date(value.$date);
    if (value.date) return new Date(value.date);
    return null;
  }
  // string or number
  return new Date(value);
}

// Convert a Date/ISO string to a human-friendly relative time
function timeAgo(value) {
  const d = parseDate(value);
  if (!d || isNaN(d.getTime())) return "";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec} sec${sec !== 1 ? "s" : ""} ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min${min !== 1 ? "s" : ""} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingIds, setProcessingIds] = useState([]);
  const [success, setSuccess] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:7777/user/requests", {
        withCredentials: true,
      });
      const data = res?.data?.availableRequest || [];
      dispatch(addRequests(data));
    } catch (err) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="p-4">Loading requests...</div>;

  return (
    <div className="max-w-4xl mx-auto my-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Connection Requests</h2>
        <div className="text-sm text-base-content/60">
          {requests?.length || 0} pending
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <div>{error}</div>
        </div>
      )}

      {/* Toast */}
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

      {!requests || requests.length === 0 ? (
        <div className="text-center text-sm text-base-content/60">
          No pending requests
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => {
            const from = r.fromUserId || r.from || r.fromUser || r;
            const key = r._id || (from && from._id) || JSON.stringify(r);
            const reqId = String(r._id || (r && r.id));

            const isProcessing = processingIds.includes(reqId);

            const handleReview = async (status) => {
              if (!reqId) {
                setError("Invalid request id");
                return;
              }
              try {
                setProcessingIds((s) => [...s, reqId]);
                setError("");
                const url = `http://localhost:7777/request/review/${status}/${reqId}`;
                await axios.post(url, {}, { withCredentials: true });
                // remove this request from the list in the store
                const newList = (requests || []).filter(
                  (x) => String(x._id) !== reqId
                );
                dispatch(addRequests(newList));
                setSuccess(
                  status === "accepted" ? "Request accepted" : "Request ignored"
                );
                setTimeout(() => setSuccess(""), 1800);
              } catch (err) {
                setError(err.message || "Action failed");
              } finally {
                setProcessingIds((s) => s.filter((id) => id !== reqId));
              }
            };
            return (
              <div
                key={key}
                className="card bg-base-100 shadow-sm rounded-lg p-4 flex gap-4 items-start">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-base-200 flex items-center justify-center shrink-0">
                  <img
                    src={
                      (from && from.photoURL) ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${(from && from.firstName) || ""} ${
                          (from && from.lastName) || ""
                        }`
                      )}&background=efefef&color=555`
                    }
                    alt={
                      (from && `${from.firstName} ${from.lastName}`) ||
                      "profile"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">
                        {(
                          from &&
                          `${from.firstName || ""} ${from.lastName || ""}`
                        ).trim() || "Unknown"}
                      </div>
                      <div className="text-xs text-base-content/60">
                        Requested to connect with you
                        {r && r.createdAt && (
                          <span className="ml-2 text-[11px] text-base-content/50">
                            • {timeAgo(r.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-base-content/70">
                      {from && from.age && (
                        <span className="mr-2">Age: {from.age}</span>
                      )}
                      {from && from.gender && <span>{from.gender}</span>}
                    </div>
                  </div>

                  {from && from.about && (
                    <p className="text-sm text-base-content/80 mt-2">
                      {truncateWords(from.about, 60)}
                    </p>
                  )}

                  <div className="mt-3">
                    {from && from.skills && from.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {from.skills.map((skill) => (
                          <span
                            key={skill}
                            className="badge badge-outline badge-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-base-content/50 italic">
                        No skills listed
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2 justify-end">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleReview("rejected")}
                      disabled={isProcessing}>
                      {isProcessing ? "..." : "Ignore"}
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleReview("accepted")}
                      disabled={isProcessing}>
                      {isProcessing ? "..." : "Accept"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;
