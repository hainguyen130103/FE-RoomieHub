// utils/chatHelpers.js
import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const ensureRooms = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;

  const roomA = doc(db, "chatRooms", currentUserId, "rooms", targetUserId);
  const roomB = doc(db, "chatRooms", targetUserId, "rooms", currentUserId);

  if (!(await getDoc(roomA)).exists()) {
    await setDoc(roomA, { lastMessage: "", updatedAt: serverTimestamp() });
  }
  if (!(await getDoc(roomB)).exists()) {
    await setDoc(roomB, { lastMessage: "", updatedAt: serverTimestamp() });
  }
};
