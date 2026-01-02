import React, { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

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

  useEffect(() => {
    getFeed();
  }, []);

  // FIX 2: Handle empty feed case safely
  if (!feed) return null;
  if (feed.length === 0)
    return <h1 className="flex justify-center my-10">No new users found!</h1>;

  return (
    <div className="flex justify-center my-4">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
