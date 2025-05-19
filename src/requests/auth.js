import api from "@utils/request";

export const login = async (data) => {
  return api.post("/auth/login", {
    account: data.account,
    password: data.password,
  });
};
