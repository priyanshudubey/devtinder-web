import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    // Remove a user from the feed by id
    removeUser: (state, action) => {
      if (!state) return state;
      const id = String(action.payload);
      return state.filter((u) => String(u._id) !== id);
    },
  },
});
export const { addFeed, removeUser } = feedSlice.actions;
export default feedSlice.reducer;
