export const ORDER_STATUS = {
  CHO_XAC_NHAN: "CHO_XAC_NHAN",
  DA_XAC_NHAN: "DA_XAC_NHAN",
  DA_HUY: "DA_HUY",
  DA_GIAO: "DA_GIAO",
  DANG_GIAOl: "DANG_GIAO",
};

export const ORDER_STATUS_MAP = {
  CHO_XAC_NHAN: {
    label: "Chờ xác nhận",
    value: ORDER_STATUS.CHO_XAC_NHAN,
    color: "orange",
  },
  DA_XAC_NHAN: {
    label: "Đã xác nhận",
    value: ORDER_STATUS.DA_XAC_NHAN,
    color: "blue",
  },
  DA_HUY: {
    label: "Đã hủy",
    value: ORDER_STATUS.DA_HUY,
    color: "red",
  },
  DA_GIAO: {
    label: "Đã giao",
    value: ORDER_STATUS.DA_GIAO,
    color: "green",
  },
  DANG_GIAO: {
    label: "Đang giao",
    value: ORDER_STATUS.DANG_GIAO,
    color: "purple",
  },
};

export const ORDER_PAYMENT_METHOD = {
  TIEN_MAT: "TIEN_MAT",
  MOMO: "MOMO",
  VNPAY: "VNPAY",
};
