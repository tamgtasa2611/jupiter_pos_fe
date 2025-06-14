import api from "@utils/request";

export const getQRCode = async (amount = 0) => {
  try {
    const res = await api.get(`/payments/generate-qr`, {
      params: { amount },
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPayment = async (data) => {
  try {
    const res = await api.post("/payments/create-for-order", data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePayment = async (data) => {
  try {
    const res = await api.put("/payments/update-for-order", data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};