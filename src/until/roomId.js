export const getRoomId = (u1, u2) =>
  Number(u1) < Number(u2) ? `${u1}_${u2}` : `${u2}_${u1}`;
