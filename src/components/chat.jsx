import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUserName, setTargetUserName] = useState("");
  const [targetUserLastName, setTargetUserLastName] = useState("");
  const [targetUserPhoto, setTargetUserPhoto] = useState("");
  console.log("Target User ID:", targetUserId);
  const loggedInUser = useSelector((store) => store.user);
  console.log("Logged In User:", loggedInUser?._id);
  const socketRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}chat/${targetUserId}`, {
        withCredentials: true,
      });
      const chatMessages = chat?.data?.messages?.map((msg) => ({
        firstName: msg.senderId?.firstName || "User",
        lastName: msg.senderId?.lastName || "",
        photoURL: msg.senderId?.photoURL || "",
        senderId: msg.senderId?._id,
        timestamp: msg.createdAt,
        text: msg.text,
      }));
      setMessages(chatMessages || []);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  // Fetch target user's name
  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}user/${targetUserId}`, {
          withCredentials: true,
        });
        setTargetUserName(res.data.firstName || "User");
        setTargetUserPhoto(res.data.photoURL || "");
        setTargetUserLastName(res.data.lastName || "");
      } catch (err) {
        console.error("Error fetching target user:", err);
        setTargetUserName("User");
        setTargetUserPhoto("");
      }
    };

    if (targetUserId) {
      fetchTargetUser();
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!loggedInUser?._id) return;
    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
    }
    const socket = socketRef.current;

    socket.emit("joinChat", {
      firstName: loggedInUser?.firstName || "User",
      targetUserId,
      loggedInUserId: loggedInUser?._id,
    });

    // Ensure only one listener is active
    socket.off("receiveMessage");
    socket.on(
      "receiveMessage",
      ({ firstName, lastName, text, timestamp, senderId }) => {
        console.log(`Received message from ${firstName}: ${text}`);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            firstName,
            lastName,
            photoURL: targetUserPhoto,
            senderId,
            text,
            timestamp: timestamp || new Date().toISOString(),
          },
        ]);
      }
    );

    // Debug: confirm room join
    socket.off("joinedRoom");
    socket.on("joinedRoom", ({ room, socketId }) => {
      console.log(`Joined room: ${room} as socket ${socketId}`);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("joinedRoom");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    targetUserId,
    loggedInUser?._id,
    loggedInUser?.firstName,
    targetUserPhoto,
  ]);

  const sendMessage = () => {
    try {
      const socket = socketRef.current;
      if (!socket) {
        console.warn("Socket not connected; cannot send message");
        return;
      }
      const messageData = {
        firstName: loggedInUser?.firstName || "User",
        targetUserId,
        loggedInUserId: loggedInUser?._id,
        text: newMessage,
      };
      console.log("Sending message:", messageData);
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [
        ...prev,
        {
          firstName: loggedInUser?.firstName || "User",
          lastName: loggedInUser?.lastName || "",
          photoURL: loggedInUser?.photoURL || "",
          senderId: loggedInUser?._id,
          text: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="w-1/2 mx-auto border border-purple-900 m-5 h-[70vh] flex flex-col">
      <div className="p-5 border-b border-gray-600 flex items-center gap-3">
        {targetUserPhoto && (
          <img
            src={targetUserPhoto}
            alt={targetUserName}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <h1 className="font-bold text-lg">
          {targetUserName} {targetUserLastName}
        </h1>
      </div>
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === loggedInUser?._id;
          return (
            <div
              key={index}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}>
              {!isSender && msg.photoURL && (
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={msg.photoURL}
                      alt={msg.firstName}
                    />
                  </div>
                </div>
              )}
              <div className="chat-header">
                <span className="font-bold">
                  {isSender ? "You" : msg.firstName + " " + msg.lastName}
                </span>
                <time className="text-xs opacity-50 ml-2">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : ""}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  isSender ? "bg-purple-900" : "bg-gray-700"
                }`}>
                {msg.text}
              </div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-purple-900 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="input input-bordered flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary bg-purple-900 hover:bg-purple-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
