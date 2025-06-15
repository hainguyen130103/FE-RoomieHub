import api from "../axios";

export const loginApi = (email, password) => {
  const payload = { email, password };
  console.log("API Request payload: ", payload);

  return api.post("/api/auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const registerApi = (email, password, fullname) => {
  const payload = {
    email,
    password,
    fullname,
  };

  console.log("API Request Payload:", payload);

  return api.post("/api/auth/register", payload);
};
