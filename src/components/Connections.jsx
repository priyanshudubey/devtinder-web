import React, { useEffect } from "react";

// Truncate text to a given number of words and append ellipsis if truncated
function truncateWords(text, limit = 15) {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
}
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:7777/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
      return res.data;
    } catch (err) {
      return err.message;
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    connections && (
      <div className="my-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Connections</h2>
          <p className="text-sm text-base-content/60">
            {connections.length} friends
          </p>
        </div>

        {/* Column-wise cards with details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map((connection) => {
            const {
              _id,
              firstName,
              lastName,
              photoURL,
              skills,
              age,
              gender,
              about,
            } = connection;

            return (
              <div
                key={_id}
                className="card bg-base-300 shadow-md rounded-lg p-4 flex gap-4 items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-base-200 flex items-center justify-center shrink-0">
                  <img
                    src={
                      photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${firstName || ""} ${lastName || ""}`
                      )}&background=efefef&color=555`
                    }
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">
                        {firstName} {lastName}
                      </div>
                      <div className="text-xs text-base-content/60">Friend</div>
                    </div>
                    <div className="text-sm text-base-content/70">
                      {age && <span className="mr-2">Age: {age}</span>}
                      {gender && <span>{gender}</span>}
                    </div>
                  </div>

                  {about && (
                    <p className="text-sm text-base-content/80 mt-2">
                      {truncateWords(about, 15)}
                    </p>
                  )}

                  <div className="mt-3">
                    {skills && skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
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
                    <button className="btn btn-ghost btn-sm">Ignore</button>
                    <button className="btn btn-primary btn-sm">Message</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Connections;
