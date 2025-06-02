export const setTokenWithExpiry = (token, user) => {
  const now = new Date();
  const item = {
    token,
    expiry: now.getTime() + 4 * 60 * 60 * 1000, // 4 tiếng tính bằng ms
    user: user || null, // Lưu thông tin người dùng nếu có
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

export const getUserFromToken = () => {
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
    return item.user;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};

export const uploadToCloudinary = async (
  file,
  uploadPreset = "my_preset",
  cloudName = "dydv1jwq2",
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("tags", "temporary"); // Gán tag tạm thời (đánh dấu là ảnh tạm thời => nếu ko submit form thì tự xóa sau 15p)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload thất bại");
  return data.secure_url;
};
