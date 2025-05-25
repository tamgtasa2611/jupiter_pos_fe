export const setTokenWithExpiry = (token) => {
  const now = new Date();
  const item = {
    token,
    expiry: now.getTime() + 4 * 60 * 60 * 1000, // 4 tiếng tính bằng ms
  };
  localStorage.setItem("token", JSON.stringify(item));
};

export const getToken = () => {
  const itemStr = localStorage.getItem("token");
  if (!itemStr) return null;
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (
      item.expiry == null ||
      item.expiry == undefined ||
      now.getTime() > item.expiry
    ) {
      localStorage.removeItem("token");
      return null;
    }
    return item.token;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};
