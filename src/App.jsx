import { Routes, Route, BrowserRouter } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/"
            element={<Body />}>
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
              path="/feed"
              element={<Feed />}
            />
            <Route
              path="/connections"
              element={<Connections />}
            />
            <Route
              path="/requests"
              element={<Requests />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
