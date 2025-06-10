export const ORDER_STATUS = {
  DON_NHAP: "DON_NHAP",
  CHO_XAC_NHAN: "CHO_XAC_NHAN",
  DA_XAC_NHAN: "DA_XAC_NHAN",
  DANG_VAN_CHUYEN: "DANG_VAN_CHUYEN",
  DA_GIAO: "DA_GIAO",
  DA_HUY: "DA_HUY",
};

export const ORDER_STATUS_MAP = {
  DON_NHAP: {
    label: "Đơn nháp",
    value: ORDER_STATUS.DON_NHAP,
    color: "gray",
  },
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

  DANG_VAN_CHUYEN: {
    label: "Đang vận chuyển",
    value: ORDER_STATUS.DANG_VAN_CHUYEN,
    color: "purple",
  },
  DA_GIAO: {
    label: "Đã giao",
    value: ORDER_STATUS.DA_GIAO,
    color: "green",
  },
  DA_HUY: {
    label: "Đã hủy",
    value: ORDER_STATUS.DA_HUY,
    color: "red",
  },
};

export const ORDER_PAYMENT_METHOD = {
  TIEN_MAT: "TIEN_MAT",
  MOMO: "MOMO",
  VNPAY: "VNPAY",
};
