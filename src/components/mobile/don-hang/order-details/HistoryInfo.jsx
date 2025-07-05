import { Timeline, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ORDER_STATUS_MAP } from "@constants/order";
import dayjs from "dayjs";

const HistoryInfo = ({ order }) => {
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        padding: 16,
      }}
    >
      <Timeline
        mode="left"
        items={
          order.orderHistories?.map((history) => ({
            label: (
              <Flex gap={8} align="center" justify="flex-end">
                <div>{ORDER_STATUS_MAP[history.oldStatus]?.label}</div>{" "}
                <div>→</div>
                <div>{ORDER_STATUS_MAP[history.newStatus]?.label}</div>
              </Flex>
            ),
            children: (
              <div>
                <Flex gap={8} align="center">
                  <UserOutlined />
                  <b>{history.user?.fullName}</b>
                </Flex>
                <div style={{ color: "#888" }}>
                  {dayjs(history.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </div>
              </div>
            ),
            color: "blue",
          })) || []
        }
      />
    </div>
  );
};

export default HistoryInfo;
