import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { BsChatRightTextFill } from "react-icons/bs";
import { Link } from "react-router-dom";

// Truncate text to a given number of words and append ellipsis if truncated
// function truncateWords(text, limit = 15) {
//   if (!text) return "";
//   const words = text.split(/\s+/);
//   if (words.length <= limit) return text;
//   return words.slice(0, limit).join(" ") + "...";
// }
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}user/connections`, {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className="card bg-base-300 shadow-md rounded-lg p-3 flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-base-200 flex items-center justify-center shrink-0">
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

                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold truncate">
                      {firstName} {lastName}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {age && <span className="mr-2">Age: {age}</span>}
                      {gender && <span>{gender}</span>}
                    </div>
                  </div>
                </div>

                {about && (
                  <p className="text-sm text-base-content/80 line-clamp-2">
                    {about}
                  </p>
                )}

                <div className="mt-1">
                  {skills && skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="badge badge-outline badge-sm">
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="text-xs text-base-content/50">
                          +{skills.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-base-content/50 italic">
                      No skills listed
                    </div>
                  )}
                </div>

                <div className="mt-2 flex gap-2 justify-end">
                  <button className="btn bg-purple-900 hover:bg-purple-700 btn-sm">
                    Ignore
                  </button>
                  <Link to={"/chat/" + _id}>
                    <button className="btn bg-purple-900 hover:bg-purple-700 btn-sm flex items-center gap-2">
                      <BsChatRightTextFill />
                      Message
                    </button>
                  </Link>
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
