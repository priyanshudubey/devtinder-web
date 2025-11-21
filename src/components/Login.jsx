import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("elonmusk@gmail.com");
  const [password, setPassword] = useState("Password@123");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError("");
    // If signup flow, first create account then login
    if (isSignup) {
      try {
        await axios.post(
          "http://localhost:7777/signup",
          { firstName, lastName, emailId, password },
          { withCredentials: true }
        );
        // after successful signup, auto-login user
        const response = await axios.post(
          "http://localhost:7777/login",
          { emailId, password },
          { withCredentials: true }
        );
        dispatch(addUser(response.data.user));
        // redirect to profile and open edit mode so user can complete their profile
        navigate("/profile", { state: { openEdit: true } });
      } catch (err) {
        console.log(err);
        setError(err?.response?.data || err.message || "Signup failed");
      }
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:7777/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(response.data.user));
      navigate("/feed");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data || "something went wrong!");
    }
  };

  return (
    <div className="flex justify-center mt-28">
      <fieldset className="fieldset bg-accent-content rounded-box w-xs p-4">
        <legend className="fieldset-legend text-l">
          {isSignup ? "Sign Up" : "Login"}
        </legend>
        <div className="flex justify-end mb-2">
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => setIsSignup((s) => !s)}>
            {isSignup ? "Switch to Login" : "Switch to Sign Up"}
          </button>
        </div>
        {isSignup && (
          <div>
            <label className="floating-label mt-2 mb-3">
              <span>First Name</span>
              <input
                type="text"
                className="input input-md"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label className="floating-label mt-2 mb-3">
              <span>Last Name</span>
              <input
                type="text"
                className="input input-md"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        <label className="floating-label mt-2 mb-3">
          <span>Your Email</span>
          <input
            type="email"
            className="input input-md"
            placeholder="email@site.com"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
        </label>
        <label className="floating-label mt-2 mb-3">
          <span>Password</span>
          <input
            type="password"
            className="input input-md"
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <p className="text-red-400 text-l">{error}</p>
        <button
          className="btn btn-outline btn-accent mt-3 text-white"
          onClick={handleLoginClick}>
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <span className="flex justify-center mt-4 text-md">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                className="link"
                style={{ marginLeft: "8px" }}
                onClick={() => setIsSignup(false)}>
                Login
              </button>
            </>
          ) : (
            <>
              New to this site? {"  "}
              <button
                className="link"
                style={{ marginLeft: "8px" }}
                onClick={() => setIsSignup(true)}>
                SignUp
              </button>
            </>
          )}
        </span>
      </fieldset>
    </div>
  );
};

export default Login;
