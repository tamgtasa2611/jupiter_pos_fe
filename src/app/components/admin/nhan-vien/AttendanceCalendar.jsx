import React from "react";
import { Calendar, Badge, Select, Row, Col, Typography, Card } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

const AttendanceCalendar = ({
  employees,
  selectedEmployee,
  setSelectedEmployee,
  attendanceData,
}) => {
  // Function to render attendance status cell in calendar
  const dateCellRender = (date) => {
    if (!selectedEmployee || !attendanceData[selectedEmployee.id]) return null;

    const dateStr = date.format("YYYY-MM-DD");
    const attendance = attendanceData[selectedEmployee.id].find((a) => a.date === dateStr);

    if (!attendance) return null;

    let color = "";
    let icon = null;
    let title = "";

    if (attendance.status === "present") {
      color = "green";
      icon = <CheckCircleOutlined />;
      title = `Đúng giờ: Vào ${attendance.checkIn} - Ra ${attendance.checkOut}`;
    } else if (attendance.status === "late") {
      color = "orange";
      icon = <ClockCircleOutlined />;
      title = `Đi muộn: Vào ${attendance.checkIn} - Ra ${attendance.checkOut}`;
    } else if (attendance.status === "absent") {
      color = "red";
      icon = <CloseCircleOutlined />;
      title = "Vắng mặt";
    }

    return (
      <div title={title} className="flex ant-flex-align-center ant-flex-justify-center">
        <Badge color={color} count={icon} />
      </div>
    );
  };

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Select
            placeholder="Chọn nhân viên"
            style={{ width: "100%" }}
            onChange={(value) => {
              const employee = employees.find((emp) => emp.id === value);
              setSelectedEmployee(employee);
            }}
          >
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.code} - {employee.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={16}>
          <Text type="secondary">* Xanh: Có mặt đúng giờ | Cam: Đi muộn | Đỏ: Vắng mặt</Text>
        </Col>
      </Row>

      {selectedEmployee && (
        <Calendar dateCellRender={dateCellRender} fullscreen={true} mode="month" />
      )}
      {!selectedEmployee && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Text type="secondary">Vui lòng chọn nhân viên để xem bảng chấm công</Text>
        </div>
      )}
    </Card>
  );
};

export default AttendanceCalendar;
