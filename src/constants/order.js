export const ORDER_STATUS = {
  DON_NHAP: "DON_NHAP",
  CHO_XAC_NHAN: "CHO_XAC_NHAN",
  DA_XAC_NHAN: "DA_XAC_NHAN",
  DANG_VAN_CHUYEN: "DANG_VAN_CHUYEN",
  DA_GIAO: "DA_GIAO",
  HOAN_THANH: "HOAN_THANH",
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
  HOAN_THANH: {
    label: "Hoàn thành",
    value: ORDER_STATUS.HOAN_THANH,
    color: "teal",
  },
  DA_HUY: {
    label: "Đã hủy",
    value: ORDER_STATUS.DA_HUY,
    color: "red",
    danger: true,
  },
};

export const PAYMENT_METHOD = {
  TIEN_MAT: "TIEN_MAT",
  BANKING: "BANKING",
};

export const PAYMENT_METHOD_MAP = {
  TIEN_MAT: {
    label: "Tiền mặt",
    value: PAYMENT_METHOD.TIEN_MAT,
    color: "blue",
  },
  BANKING: {
    label: "Chuyển khoản",
    value: PAYMENT_METHOD.BANKING,
    color: "orange",
  },
};

export const PAYMENT_STATUS = {
  CHUA_THANH_TOAN: "CHUA_THANH_TOAN",
  THANH_TOAN_THANH_CONG: "THANH_TOAN_THANH_CONG",
  THANH_TOAN_THAT_BAI: "THANH_TOAN_THAT_BAI",
};

export const PAYMENT_STATUS_MAP = {
  CHUA_THANH_TOAN: {
    label: "Chưa thanh toán",
    value: PAYMENT_STATUS.CHUA_THANH_TOAN,
    color: "red",
  },
  THANH_TOAN_THANH_CONG: {
    label: "Thanh toán thành công",
    value: PAYMENT_STATUS.THANH_TOAN_THANH_CONG,
    color: "green",
  },
  THANH_TOAN_THAT_BAI: {
    label: "Thanh toán thất bại",
    value: PAYMENT_STATUS.THANH_TOAN_THAT_BAI,
    color: "orange",
  },
};

export const VALID_TRANSITIONS = new Map([
  [
    ORDER_STATUS.DON_NHAP,
    new Set([
      ORDER_STATUS.DA_HUY,
      ORDER_STATUS.CHO_XAC_NHAN,
      ORDER_STATUS.HOAN_THANH,
    ]),
  ],
  [
    ORDER_STATUS.CHO_XAC_NHAN,
    new Set([
      ORDER_STATUS.DA_HUY,
      ORDER_STATUS.DA_XAC_NHAN,
      ORDER_STATUS.HOAN_THANH,
    ]),
  ],
  [
    ORDER_STATUS.DA_XAC_NHAN,
    new Set([
      ORDER_STATUS.DA_HUY,
      ORDER_STATUS.DANG_VAN_CHUYEN,
      ORDER_STATUS.HOAN_THANH,
    ]),
  ],
  [
    ORDER_STATUS.DANG_VAN_CHUYEN,
    new Set([
      ORDER_STATUS.DA_HUY,
      ORDER_STATUS.DA_GIAO,
      ORDER_STATUS.HOAN_THANH
    ]),
  ],
  [ORDER_STATUS.DA_GIAO, new Set([ORDER_STATUS.HOAN_THANH])],
  [ORDER_STATUS.HOAN_THANH, new Set()], // Không thể thay đổi nữa
  [ORDER_STATUS.DA_HUY, new Set()], // Không thể phục hồi
]);

export const ORDER_TYPE = {
  MUA_TRUC_TIEP: "MUA_TRUC_TIEP",
  MUA_ONLINE: "MUA_ONLINE",
};

export const ORDER_TYPE_MAP = {
  MUA_TRUC_TIEP: {
    label: "Mua trực tiếp",
    value: ORDER_TYPE.MUA_TRUC_TIEP,
    color: "blue",
  },
  MUA_ONLINE: {
    label: "Mua online",
    value: ORDER_TYPE.MUA_ONLINE,
    color: "green",
  },
};
