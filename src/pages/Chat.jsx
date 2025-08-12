import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatWith } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const token = localStorage.getItem("accessToken");
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id?.toString();

  const roomId = chatWith
    ? Number(currentUserId) < Number(chatWith)
      ? `${currentUserId}_${chatWith}`
      : `${chatWith}_${currentUserId}`
    : null;

  // 1. Lắng nghe danh sách chat (rooms) realtime như Fireship
  useEffect(() => {
    if (!currentUserId) return;
    const q = query(
      collection(db, "chatRooms", currentUserId, "rooms"),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const rooms = snap.docs.map((doc) => ({ userId: doc.id, ...doc.data() }));
      setChatList(rooms);
    });
    return () => unsub();
  }, [currentUserId]);

  // 2. Lắng nghe tin nhắn khi chọn room
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
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [roomId]);

  // 3. Tạo room nếu chưa có, update metadata (Fireship style)
  const ensureRooms = async () => {
    if (!chatWith) return;
    const roomA = doc(db, "chatRooms", currentUserId, "rooms", chatWith);
    const roomB = doc(db, "chatRooms", chatWith, "rooms", currentUserId);
    if (!(await getDoc(roomA)).exists()) {
      await setDoc(roomA, { lastMessage: "", updatedAt: serverTimestamp() });
    }
    if (!(await getDoc(roomB)).exists()) {
      await setDoc(roomB, { lastMessage: "", updatedAt: serverTimestamp() });
    }
  };

  // 4. Gửi tin nhắn
  const sendMessage = async () => {
    if (!input.trim() || !roomId) return;

    await ensureRooms();

    // Thêm message
    await addDoc(collection(db, "messages", roomId, "chats"), {
      sender: currentUserId,
      text: input,
      createdAt: serverTimestamp(),
    });

    // Cập nhật lastMessage trong danh sách room
    await setDoc(
      doc(db, "chatRooms", currentUserId, "rooms", chatWith),
      { lastMessage: input, updatedAt: serverTimestamp() },
      { merge: true }
    );
    await setDoc(
      doc(db, "chatRooms", chatWith, "rooms", currentUserId),
      { lastMessage: input, updatedAt: serverTimestamp() },
      { merge: true }
    );

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
        {/* Danh sách chat (trái) */}
        <div className="w-1/4 border-r pr-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-3">Danh sách chat</h3>
          {chatList.length === 0 && (
            <p className="text-gray-400">Chưa có cuộc trò chuyện</p>
          )}
          <div className="space-y-2">
            {chatList.map((r) => (
              <div
                key={r.userId}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${r.userId === chatWith ? "bg-gray-200" : ""}`}
                onClick={() =>
                  navigate("/chat", { state: { chatWith: r.userId } })
                }
              >
                <div className="font-semibold">User {r.userId}</div>
                <div className="text-sm text-gray-500 truncate">
                  {r.lastMessage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat box (phải) */}
        <div className="w-3/4 pl-4 flex flex-col">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            {chatWith
              ? `Chat với user ${chatWith}`
              : "Chọn một cuộc trò chuyện để bắt đầu"}
          </h2>

          <div className="flex-1 overflow-y-auto p-2 border rounded bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={m.id}
                className={`mb-2 p-2 rounded-lg max-w-[70%] ${m.sender === currentUserId ? "bg-green-200 ml-auto text-right" : "bg-gray-200"}`}
              >
                <div>{m.text}</div>
                {m.createdAt?.seconds && (
                  <div className="text-xs text-gray-500">
                    {new Date(m.createdAt.seconds * 1000).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {chatWith && (
            <div className="flex mt-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded p-2"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-green-500 text-white px-4 rounded"
              >
                Gửi
              </button>
            </div>
          )}
        </div>
      </div>
    </SidebarNav>
  );
};

export default Chat;
