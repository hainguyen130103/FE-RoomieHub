// utils/chatHelpers.js
import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const ensureRooms = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;

  const cId = String(currentUserId);
  const tId = String(targetUserId);

  const roomA = doc(db, "chatRooms", cId, "rooms", tId);
  const roomB = doc(db, "chatRooms", tId, "rooms", cId);

  const roomASnap = await getDoc(roomA);
  if (!roomASnap.exists()) {
    await setDoc(roomA, { lastMessage: "", updatedAt: serverTimestamp() });
  }

  const roomBSnap = await getDoc(roomB);
  if (!roomBSnap.exists()) {
    await setDoc(roomB, { lastMessage: "", updatedAt: serverTimestamp() });
  }
};
