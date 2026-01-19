import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Post = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content cannot be empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}post/create`,
        { content },
        { withCredentials: true }
      );

      setContent("");
      if (onPostCreated) {
        onPostCreated(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-lg p-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text font-semibold">
            What's on your mind today?
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <textarea
              className="textarea textarea-bordered flex-1"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}></textarea>
            <button
              className="btn bg-purple-900 hover:bg-purple-700"
              type="submit"
              disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
        {error && <div className="text-error text-sm mt-2">{error}</div>}
      </label>
    </div>
  );
};

export default Post;
