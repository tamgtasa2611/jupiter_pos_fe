"use client";

import { Button, Input, Typography, Form, message } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Newsletter = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values:", values);
    message.success("Cảm ơn bạn đã đăng ký nhận tin!");
    form.resetFields();
  };

  return (
    <div className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <MailOutlined className="text-4xl text-blue-500 mb-4" />
          <Title level={2} className="mb-3">
            Đăng ký nhận tin
          </Title>
          <Paragraph className="text-gray-600 mb-8">
            Nhận thông tin về các bộ sưu tập mới nhất và ưu đãi đặc biệt từ Jupiter Store
          </Paragraph>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <div className="flex flex-col sm:flex-row gap-3">
              <Form.Item
                name="email"
                className="m-0 flex-1"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="Nhập email của bạn" size="large" />
              </Form.Item>
              <Button type="primary" size="large" htmlType="submit">
                Đăng ký
              </Button>
            </div>
          </Form>

          <Paragraph className="text-gray-500 text-sm mt-4">
            Bạn có thể hủy đăng ký bất cứ lúc nào. Chúng tôi tôn trọng quyền riêng tư của bạn.
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
