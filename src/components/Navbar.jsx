import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}logout`,
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
    <div className="navbar bg-indigo-700 border-b shadow-sm">
      <div className="flex-1">
        <Link
          className="normal-case text-xl font-semibold text-white flex"
          to="/feed">
          <img
            src="/mmn-logo.png"
            alt="Mentor Match logo"
            className="h-10 w-24 object-contain"
          />
          <span>Mentor Match</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="dropdown dropdown-end">
            <button
              className="flex items-center gap-3 px-3 py-1 rounded hover:bg-base-200"
              tabIndex={0}>
              <div className="text-sm">
                Welcome, <span className="font-medium">{user.firstName}</span>
              </div>
              <div className="avatar">
                <div className="w-9 rounded-full ring-2 ring-white overflow-hidden">
                  <img
                    alt="User Photo"
                    src={user.photoURL}
                  />
                </div>
              </div>
            </button>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-indigo-700 rounded-box mt-2 w-44 p-2 shadow">
              <li>
                <Link
                  to="/profile"
                  className="justify-between">
                  Profile<span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/premium">Premium</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="mr-4">
            <Link
              to="/login"
              className="btn btn-sm btn-outline">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
