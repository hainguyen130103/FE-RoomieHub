import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SidebarNav from "../components/layouts/SidebarNav";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { SendOutlined, MessageOutlined } from "@ant-design/icons";
import { ensureRooms } from "../until/chatHelpers";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { chatWith } = location.state || {};

  const targetUserId = id || chatWith;

  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const token = localStorage.getItem("accessToken");
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id?.toString();

  const roomId = targetUserId
    ? Number(currentUserId) < Number(targetUserId)
      ? `${currentUserId}_${targetUserId}`
      : `${targetUserId}_${currentUserId}`
    : null;

  // Lắng nghe danh sách chat
  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, "chatRooms", currentUserId, "rooms"),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const rooms = snap.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
      }));
      setChatList(rooms);
    });

    return () => unsub();
  }, [currentUserId]);

  // Lắng nghe tin nhắn
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, "messages", roomId, "chats"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsub();
  }, [roomId]);
  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!input.trim() || !roomId) return;

    await ensureRooms();

    await addDoc(collection(db, "messages", roomId, "chats"), {
      sender: currentUserId,
      text: input,
      createdAt: serverTimestamp(),
    });

    await setDoc(
      doc(db, "chatRooms", currentUserId, "rooms", targetUserId),
      { lastMessage: input, updatedAt: serverTimestamp() },
      { merge: true }
    );
    await setDoc(
      doc(db, "chatRooms", targetUserId, "rooms", currentUserId),
      { lastMessage: input, updatedAt: serverTimestamp() },
      { merge: true }
    );

    setInput("");
  };

  if (!currentUserId) {
    return (
      <p className="text-center text-red-500 mt-10 text-lg font-semibold">
        🚫 Vui lòng đăng nhập để chat
      </p>
    );
  }

  return (
    <SidebarNav>
      <div className="bg-white rounded-xl shadow-lg h-[80vh] flex overflow-hidden">
        {/* Danh sách chat */}
        <div className="w-1/4 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b bg-white shadow-sm flex items-center gap-2">
            <MessageOutlined className="text-green-500 text-lg" />
            <h3 className="text-lg font-bold">Cuộc trò chuyện</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatList.length === 0 ? (
              <p className="text-gray-400 text-center mt-6">
                Chưa có cuộc trò chuyện
              </p>
            ) : (
              chatList.map((r) => (
                <div
                  key={r.userId}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border 
            ${
              r.userId === targetUserId
                ? "bg-green-100 border-green-300 shadow-sm"
                : "bg-white hover:bg-green-50 border-transparent"
            }`}
                  onClick={() =>
                    navigate(`/chat/${r.userId}`, {
                      state: { chatWith: r.userId },
                    })
                  }
                >
                  {/* Avatar giả lập */}
                  <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                    {r.userId?.toString().charAt(0).toUpperCase()}
                  </div>

                  {/* Thông tin user */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      Người dùng {r.userId}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {r.lastMessage || "Chưa có tin nhắn"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat box */}
        <div className="w-3/4 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-green-600">
              {targetUserId
                ? `💬 Chat với người dùng ${targetUserId}`
                : "Chọn một cuộc trò chuyện để bắt đầu"}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-3 p-3 rounded-2xl shadow-sm max-w-[70%] ${
                  m.sender === currentUserId
                    ? "bg-green-500 text-white ml-auto rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <div>{m.text}</div>
                {m.createdAt?.seconds && (
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(m.createdAt.seconds * 1000).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          {targetUserId && (
            <div className="p-4 bg-white border-t flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition flex items-center justify-center"
              >
                <SendOutlined />
              </button>
            </div>
          )}
        </div>
      </div>
    </SidebarNav>
  );
};

export default Chat;
