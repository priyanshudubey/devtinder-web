import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:7777/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <div className="navbar bg-accent-content shadow-sm">
      <div className="flex-1">
        <Link
          className="btn btn-ghost text-xl"
          to="/feed">
          DevTinder
        </Link>
      </div>
      <div className="flex gap-2">
        {user && (
          <div className="dropdown dropdown-end mx-5 flex">
            <p className="px-4">Welcome, {user.firstName}</p>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar mx-5">
              <div className="w-10 rounded-full">
                <img
                  alt="User Photo"
                  src={user.photoURL}
                />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link
                  to="/profile"
                  className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
