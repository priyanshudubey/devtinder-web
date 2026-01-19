import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { CiMenuKebab } from "react-icons/ci";

const PostDisplay = ({ post, onUpdate, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState(post.content);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const currentUser = useSelector((store) => store.user);

  const isLiked = post.likes?.includes(currentUser?._id);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;
  const isPostOwner = post.authorId?._id === currentUser?._id;

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}post/${post._id}/like`,
        {},
        { withCredentials: true }
      );
      if (onUpdate) {
        onUpdate(response.data.data);
      }
    } catch (err) {
      console.error("Failed to like post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}post/${post._id}/comment`,
        { text: commentText },
        { withCredentials: true }
      );
      setCommentText("");
      if (onUpdate) {
        onUpdate(response.data.data);
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async () => {
    if (!editPostContent.trim()) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}post/${post._id}`,
        { content: editPostContent },
        { withCredentials: true }
      );
      setEditingPostId(null);
      if (onUpdate) {
        onUpdate(response.data.data);
      }
    } catch (err) {
      console.error("Failed to edit post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        await axios.delete(`${BASE_URL}post/${post._id}`, {
          withCredentials: true,
        });
        if (onDelete) {
          onDelete(post._id);
        }
      } catch (err) {
        console.error("Failed to delete post", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}post/${post._id}/comment/${commentId}`,
        { text: editCommentText },
        { withCredentials: true }
      );
      setEditingCommentId(null);
      setEditCommentText("");
      if (onUpdate) {
        onUpdate(response.data.data);
      }
    } catch (err) {
      console.error("Failed to edit comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        setLoading(true);
        const response = await axios.delete(
          `${BASE_URL}post/${post._id}/comment/${commentId}`,
          { withCredentials: true }
        );
        if (onUpdate) {
          onUpdate(response.data.data);
        }
      } catch (err) {
        console.error("Failed to delete comment", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return postDate.toLocaleDateString();
  };

  return (
    <div className="card bg-base-200 shadow-md mb-4">
      <div className="card-body p-4">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={post.authorId?.photoURL}
                  alt={post.authorId?.firstName}
                />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-1">
                {post.authorId?.firstName} {post.authorId?.lastName}
                {post.authorId?.membershipType &&
                  post.authorId?.membershipType !== "Free" && (
                    <RiVerifiedBadgeFill className="w-4 h-4 text-blue-500" />
                  )}
              </h4>
              <p className="text-xs text-base-content/60">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Post Menu */}
          {isPostOwner && (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-sm">
                <CiMenuKebab className="text-xl" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-10 w-32 p-2 shadow">
                <li>
                  <a onClick={() => setEditingPostId(post._id)}>Edit</a>
                </li>
                <li>
                  <a
                    onClick={handleDeletePost}
                    className="text-error">
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Edit Post Mode */}
        {editingPostId === post._id ? (
          <div className="mb-4">
            <textarea
              className="textarea textarea-bordered w-full mb-2"
              value={editPostContent}
              onChange={(e) => setEditPostContent(e.target.value)}
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditPost}
                disabled={loading}
                className="btn btn-sm btn-primary">
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditingPostId(null);
                  setEditPostContent(post.content);
                }}
                disabled={loading}
                className="btn btn-sm btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Post Content */}
            <p className="text-sm mb-4 leading-relaxed">{post.content}</p>

            {/* Media (if any) */}
            {post.mediaUrl && (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full rounded-lg mb-4 max-h-96 object-cover"
              />
            )}
          </>
        )}

        {/* Post Stats */}
        <div className="flex gap-4 text-xs text-base-content/60 mb-3 pb-3 border-b border-base-300">
          <span>{likeCount} likes</span>
          <span>{commentCount} comments</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex-1 btn btn-sm ${
              isLiked ? "btn bg-purple-900 hover:bg-purple-700" : "btn-ghost"
            }`}>
            {isLiked ? "❤️ Liked" : "🤍 Like"}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 btn btn-sm btn-ghost">
            💬 Comment
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-base-300 pt-3">
            {/* Comment Input */}
            <form
              onSubmit={handleComment}
              className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={loading}
                className="input input-sm input-bordered flex-1"
              />
              <button
                type="submit"
                disabled={loading || !commentText.trim()}
                className="btn btn-sm btn-primary">
                {loading ? "..." : "Add"}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment, idx) => {
                  const isCommentAuthor =
                    comment.userId?._id === currentUser?._id;
                  const canDeleteComment = isPostOwner || isCommentAuthor;

                  return (
                    <div
                      key={idx}
                      className="bg-base-100 rounded p-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.userId?.photoURL}
                            alt={comment.userId?.firstName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-semibold text-xs">
                            {comment.userId?.firstName}{" "}
                            {comment.userId?.lastName}
                          </span>
                          <span className="text-xs text-base-content/60">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        {/* Comment Menu */}
                        {canDeleteComment && (
                          <div className="dropdown dropdown-end">
                            <button
                              tabIndex={0}
                              className="btn btn-ghost btn-xs">
                              <CiMenuKebab className="text-lg" />
                            </button>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu bg-base-100 rounded-box z-10 w-32 p-2 shadow">
                              {isCommentAuthor && (
                                <li>
                                  <a
                                    onClick={() => {
                                      setEditingCommentId(comment._id);
                                      setEditCommentText(comment.text);
                                    }}>
                                    Edit
                                  </a>
                                </li>
                              )}
                              {canDeleteComment && (
                                <li>
                                  <a
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                    className="text-error">
                                    Delete
                                  </a>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Edit Comment Mode */}
                      {editingCommentId === comment._id ? (
                        <div className="ml-8 mt-2">
                          <input
                            type="text"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            disabled={loading}
                            className="input input-sm input-bordered w-full mb-2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditComment(comment._id)}
                              disabled={loading}
                              className="btn btn-xs btn-primary">
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              disabled={loading}
                              className="btn btn-xs btn-ghost">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs ml-8">{comment.text}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-base-content/60 text-center py-2">
                  No comments yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDisplay;
