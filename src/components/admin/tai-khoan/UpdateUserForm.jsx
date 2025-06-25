"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, App, Switch, Select } from "antd";
import { getUserFromToken } from "@/utils/utils";
import { updateUser } from "@/requests/user";

const genderOptions = [
  { label: "Nam", value: true },
  { label: "Nữ", value: false },
];

const UpdateUserForm = ({ fetchUserData }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const user = getUserFromToken();
  const role = user?.role || EMPLOYEE;

  useEffect(() => {
    const user = getUserFromToken();
    form.setFieldsValue({
      username: user?.username || "",
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender,
      active: user?.active,
    });
  }, [form]);

  const onFinish = async (values) => {
    setLoadingSubmit(true);
    setAlertMessage("");
    const user = getUserFromToken();
    const requestBody = {
      username: values.username !== null ? values.username : null,
      fullName: values.fullName !== null ? values.fullName : null,
      email: values.email !== null ? values.email : null,
      phone: values.phone !== null ? values.phone : null,
      gender: values.gender !== null ? values.gender : null,
      active: values.active !== null ? values.active : null,
    };
    try {
      const res = await updateUser(user.id, requestBody);
      setAlertMessage("Cập nhật người dùng thành công.");
      setMessageType("success");
      fetchUserData();
    } catch (error) {
      let errorMessage = "Cập nhật người dùng thất bại.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      setAlertMessage(errorMessage);
      setMessageType("error");
    }
    setLoadingSubmit(false);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
      >
        <Input placeholder="Tên đăng nhập" size="large" />
      </Form.Item>
      <Form.Item
        label="Họ và tên"
        name="fullName"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
      >
        <Input placeholder="Họ và tên" size="large" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: "email", message: "Email không hợp lệ" }]}
      >
        <Input placeholder="Email" size="large" />
      </Form.Item>
      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
        ]}
      >
        <Input placeholder="Số điện thoại" size="large" />
      </Form.Item>
      <Form.Item label="Giới tính" name="gender">
        <Select
          options={genderOptions}
          placeholder="Chọn giới tính"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loadingSubmit}
          block
          size="large"
        >
          Cập nhật thông tin
        </Button>
      </Form.Item>
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={messageType}
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Form>
  );
};

export default UpdateUserForm;
