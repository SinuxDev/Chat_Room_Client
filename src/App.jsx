import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";

//Import pages
import Welcome from "./pages/Welcome";
import Room from "./pages/Room";

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [socket, setSocket] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Welcome
          username={username}
          setUsername={setUsername}
          setRoom={setRoom}
          room={room}
          setSocket={setSocket}
        />
      ),
    },
    {
      path: "/room",
      element: <Room username={username} room={room} socket={socket} />,
    },
  ]);
  return (
    <section>
      <RouterProvider router={router} />
    </section>
  );
};

export default App;
