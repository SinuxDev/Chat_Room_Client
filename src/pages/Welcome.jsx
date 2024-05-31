import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client";

import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Welcome = ({ username, setUsername, room, setRoom, setSocket }) => {
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();
    if (
      username.trim().length > 0 &&
      room != "select-room" &&
      room.trim().length > 0
    ) {
      const socket = socketIO.connect("http://localhost:3000");
      setSocket(socket);

      navigate("/room", { replace: true });
    } else {
      toastFire("Please enter a valid username and select a room to continue.");
      console.log(toastFire);
    }
  };

  const toastFire = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 bg-slate-400 p-10 rounded-lg">
        <h1 className="text-5xl font-bold text-center text-white mb-6">
          SuChat.io
        </h1>
        <p className="text-2xl font-mono text-center text-white mb-6">
          Enter your username and room name to start chatting.
        </p>
        <form onSubmit={joinRoom}>
          <div className="mb-3">
            <input
              type="text"
              id="username"
              placeholder="username..."
              className="border-2 border-blue-500 outline-none p-2.5 rounded-lg w-full text-base font-medium"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              name="room"
              id="room"
              className="border-2 border-blue-500 text-black text-base font-medium rounded-lg p-2.5 focus:ring-blue-600 block w-full text-center"
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="select-room">--- Select Room ---</option>
              <option value="js">JavaScript</option>
              <option value="node">Node</option>
              <option value="react">React</option>
            </select>
          </div>
          <button
            className="text-center text-base text-white bg-blue-500 py-3.5 rounded-lg w-full font-medium hover:bg-blue-600 transition duration-200 ease-in-out"
            type="submit"
            onClick={toastFire}
          >
            Join Room
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </section>
  );
};

Welcome.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  room: PropTypes.string.isRequired,
  setRoom: PropTypes.func.isRequired,
  setSocket: PropTypes.func.isRequired,
};

export default Welcome;
