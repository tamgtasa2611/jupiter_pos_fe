import api from "@utils/request";

export const getQRCode = async (amount = 0) => {
  try {
    const res = await api.get(`/payments/generate-qr`, { 
        params: { amount } 
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};