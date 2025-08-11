import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarNav from "../components/layouts/SidebarNav";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { jwtDecode } from "jwt-decode";

const Chat = () => {
  const location = useLocation();
  const { chatWith } = location.state || {}; // userId của người kia

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatList, setChatList] = useState([]);

  const token = localStorage.getItem("accessToken");
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id?.toString();

  const roomId =
    Number(currentUserId) < Number(chatWith)
      ? `${currentUserId}_${chatWith}`
      : `${chatWith}_${currentUserId}`;

  // Lắng nghe tin nhắn
  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "messages", roomId, "chats"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (!input.trim() || !roomId) return;
    await addDoc(collection(db, "messages", roomId, "chats"), {
      sender: currentUserId,
      text: input,
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  if (!currentUserId) {
    return (
      <p className="text-center text-red-500 mt-10">
        Vui lòng đăng nhập để chat
      </p>
    );
  }

  return (
    <SidebarNav>
      <div className="bg-white rounded-lg shadow p-4 h-[80vh] flex">
        {/* Cột trái: danh sách người đã chat */}
        <div className="w-1/4 border-r pr-2">
          <h3 className="text-lg font-bold mb-3">Danh sách chat</h3>
          <div className="space-y-2">
            {chatList.map((user) => (
              <div
                key={user.id}
                className={`p-2 rounded cursor-pointer hover:bg-green-100 ${
                  user.id === chatWith ? "bg-green-200" : ""
                }`}
              >
                {user.name}
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: khung chat */}
        <div className="w-3/4 pl-4 flex flex-col">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Chat với user {chatWith}
          </h2>

          <div className="flex-1 overflow-y-auto border p-2 mb-3 rounded bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center mt-4">Chưa có tin nhắn</p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                    m.sender === currentUserId
                      ? "bg-green-200 ml-auto text-right"
                      : "bg-gray-200"
                  }`}
                >
                  <div>{m.text}</div>
                  {m.createdAt?.seconds && (
                    <div className="text-xs text-gray-500">
                      {new Date(
                        m.createdAt.seconds * 1000
                      ).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex">
            <input
              className="border p-2 flex-1 rounded"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-green-500 text-white px-4 ml-2 rounded"
              onClick={sendMessage}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </SidebarNav>
  );
};

export default Chat;
