import React, { useEffect, useState } from "react";
import { addFeed } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import Post from "./Post";
import PostDisplay from "./PostDisplay";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const getFeed = async () => {
    // FIX 1: Only return if feed exists AND has items
    if (feed && feed.length > 0) return;

    try {
      const res = await axios.get(`${BASE_URL}feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.user));
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await axios.get(`${BASE_URL}post/feed`, {
        withCredentials: true,
      });
      setPosts(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch posts", err.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    getFeed();
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  // FIX 2: Handle empty feed case safely
  if (!feed) return null;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Main Layout */}
      <div className="flex gap-6 p-4 max-w-7xl mx-auto">
        {/* Left Side - Post and Feed */}
        <div className="flex-1">
          {/* Post Section */}
          <div className="mb-6">
            <Post onPostCreated={handlePostCreated} />
          </div>

          {/* Posts from connections */}
          <div>
            {loadingPosts ? (
              <div className="text-center py-8">
                <p className="text-base-content/60">Loading posts...</p>
              </div>
            ) : posts && posts.length > 0 ? (
              <div>
                {posts.map((post) => (
                  <PostDisplay
                    key={post._id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-base-200 rounded-lg p-8 text-center text-base-content/60">
                <p className="text-lg">
                  No posts yet. Start connecting to see posts!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - User Cards */}
        <div className="w-64">
          <div className="sticky top-4">
            <h3 className="text-lg font-bold mb-3">Suggested Users</h3>
            <div className="space-y-3 max-h-[calc(100vh-100px)] overflow-y-auto">
              {feed && feed.length > 0 ? (
                feed.map((user) => (
                  <div
                    key={user._id}
                    className="card card-compact bg-base-200 shadow-md">
                    <div className="card-body p-3">
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img
                              src={user.photoURL}
                              alt={user.firstName}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-xs text-base-content/60 truncate">
                            {user.about}
                          </p>
                        </div>
                      </div>
                      <div className="card-actions justify-between mt-2 gap-1">
                        <button className="btn bg-purple-900 hover:bg-purple-700 btn-xs flex-1">
                          Ignore
                        </button>
                        <button className="btn bg-purple-900 hover:bg-purple-700 btn-xs flex-1">
                          Interested
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-base-content/60 text-sm">
                  No new users found!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
