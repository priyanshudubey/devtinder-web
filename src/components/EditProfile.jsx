import React, { useState } from "react";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

function EditProfile({ user, onCancel }) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [age, setAge] = useState(user?.age || "");
  const [skills, setSkills] = useState(user?.skills || "");
  const [about, setAbout] = useState(user?.about || "");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${BASE_URL}profile/edit`,
        {
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
          skills,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      dispatch(addUser(res.data));
      setSuccess("Profile updated successfully.");
      setTimeout(() => {
        setSuccess("");
        if (onCancel) onCancel();
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Edit Your Profile</h2>

          <form
            className="space-y-4"
            onSubmit={updateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="url"
                name="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input input-bordered w-full"
                  min="0"
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Skills</span>
              </label>
              <input
                type="text"
                name="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt">
                  Separate skills with a comma (e.g., React, Firebase, CSS)
                </span>
              </label>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">About Me</span>
              </label>
              <textarea
                name="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="textarea textarea-bordered h-24"
                placeholder="Tell us a bit about yourself..."></textarea>
            </div>
            <div className="card-actions justify-end items-center flex-wrap gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn btn-outline">
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>

              <div className="grow md:grow-0"></div>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-ghost">
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-purple-900 hover:bg-purple-700">
                Save Changes
              </button>
            </div>
          </form>
          {error && (
            <div
              className="mt-4"
              role="alert">
              <div className="alert alert-error shadow-lg">
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
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M12 6v6m0 6h.01"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div
              className="mt-4"
              role="status">
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
          {showPreview && (
            <div className="mt-8 border-t border-base-300 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Profile Preview
              </h3>
              <UserCard
                user={{
                  firstName,
                  lastName,
                  photoURL,
                  age,
                  gender,
                  about,
                  skills,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
