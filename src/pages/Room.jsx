import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRightEndOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const Room = ({ username, room, socket }) => {
  const navigate = useNavigate();
  const [roomUsers, setRoomUsers] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState("");

  const boxDivRef = useRef(null);

  useEffect(() => {
    const getOldMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/room/${room}`
        );
        if (response.status === 403) {
          return navigate("/", { replace: true });
        }
        const data = await response.json();
        setReceivedMessages((prevMessages) => [...prevMessages, ...data]);
      } catch {
        console.log("Error while fetching old messages");
      }
    };

    getOldMessages();
  }, [room, navigate]);

  useEffect(() => {
    // send joined user to server
    socket.emit("join_room", { username, room });

    // get message from server
    const messageListener = (data) => {
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("message", messageListener);

    // Handle room users update
    const handleRoomUsers = (data) => {
      setRoomUsers((prevRoomUsers) => {
        const updatedRoomUsers = [...prevRoomUsers];

        data.forEach((user) => {
          const index = updatedRoomUsers.findIndex(
            (prevUser) => prevUser.id === user.id
          );

          if (index !== -1) {
            // Update the existing user
            updatedRoomUsers[index] = { ...updatedRoomUsers[index], ...user };
          } else {
            // Add new user to the array
            updatedRoomUsers.push(user);
          }
        });

        return updatedRoomUsers;
      });
    };

    // get room users from server
    socket.on("room_users", handleRoomUsers);

    return () => {
      socket.off("message", messageListener);
      socket.off("room_users", handleRoomUsers);
      socket.disconnect();
    };
  }, [socket, username, room]);

  const leaveChatRoom = () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (boxDivRef.current) {
      boxDivRef.current.scrollTop = boxDivRef.current.scrollHeight;
    }
  }, [receivedMessages]);

  const sendMessageFunction = () => {
    if (sentMessages.trim().length > 0) {
      socket.emit("chat_message", sentMessages);
      setSentMessages("");
    }
  };

  return (
    <section className="flex gap-4">
      {/* left side */}
      <div className="w-1/3 bg-blue-600 h-screen text-white font-medium relative">
        <p className="text-3xl font-bold text-center mt-5">SuChat.io</p>
        <div className="mt-10 ps-2">
          <p className="text-lg flex items-center gap-1">
            <ChatBubbleLeftRightIcon width={30} /> Room Name
          </p>
          <p className="bg-white text-blue-500 ps-5 py-2 rounded-tl-full rounded-bl-full my-2">
            {room}
          </p>
        </div>
        <div className="mt-5 ps-2">
          <p className="flex items-center gap-1 text-lg mb-3">
            <UserGroupIcon width={30} /> Users
          </p>
          {roomUsers.map((user, index) => (
            <p key={index} className="flex items-end gap-1 text-sm my-2">
              <UserIcon width={24} />
              {user.username === username ? "You" : user.username}
            </p>
          ))}
        </div>
        <button
          type="button"
          className="absolute bottom-0 flex items-center gap-1 p-2.5 w-full mx-2 mb-2 text-lg"
          onClick={leaveChatRoom}
        >
          <ArrowRightEndOnRectangleIcon width={24} /> Leave Room
        </button>
      </div>

      {/* right side */}
      <div className="w-full pt-5 relative">
        <div className="h-[30rem] overflow-y-auto" ref={boxDivRef}>
          {receivedMessages.map((message, index) => (
            <div
              key={index}
              className="text-white bg-blue-500 px-3 py-3 w-3/4 rounded-br-3xl rounded-tl-3xl mb-3"
            >
              <p className="text-sm font-medium font-mono">
                From {message.username}
              </p>
              <p className="text-lg font-medium">{message.message}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 my-2 py-2.5 flex items-end w-full px-2">
          <input
            type="text"
            placeholder="messages..."
            className="w-full outline-none border-b text-lg me-2"
            value={sentMessages}
            onChange={(e) => setSentMessages(e.target.value)}
          />
          <button type="button" onClick={sendMessageFunction}>
            <PaperAirplaneIcon
              width={30}
              className="hover:text-blue-500 hover:-rotate-45 duration-200 ease-in-out transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

Room.propTypes = {
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
  socket: PropTypes.any.isRequired,
};

export default Room;
