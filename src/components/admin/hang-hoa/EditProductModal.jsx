"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Switch,
  Button,
  Divider,
  Space,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useMobileStyles } from "@atoms/common";

const { Option } = Select;
const { TextArea } = Input;

const EditProductModal = ({ visible, onCancel, onEdit, product, categories, isMobile }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const mobileStyles = useMobileStyles();

  // Mobile style configurations
  const mobileInputStyle = { ...mobileStyles.input };
  const mobileSelectStyle = { ...mobileStyles.select };
  const mobileSwitchStyle = { ...mobileStyles.switch };
  const mobileFormItemStyle = { ...mobileStyles.formItem };
  const mobileButtonStyle = { ...mobileStyles.button };

  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        barcode: product.barcode,
        name: product.name,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        unit: product.unit,
        isActive: product.isActive,
        description: product.description || "",
      });

      // Set image if available
      if (product.image) {
        setFileList([
          {
            uid: "-1",
            name: "product-image.jpg",
            status: "done",
            url: product.image,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [visible, product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // In a real app, you would upload the image first and get the URL
      // then include it in the updatedProduct object

      const updatedProduct = {
        ...product,
        ...values,
        image: fileList.length > 0 ? fileList[0].url || fileList[0].response?.url : null,
      };

      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
        onEdit(updatedProduct);
      }, 500);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        console.error("You can only upload image files!");
        return false;
      }
      return true; // Allow the upload
    },
    fileList,
    onChange: handleUploadChange,
    maxCount: 1,
  };

  const units = ["Thùng", "Hộp", "Chai", "Lốc", "Gói"];

  return (
    <Modal
      title="Chỉnh sửa sản phẩm"
      open={visible}
      {...(!isMobile && { centered: true })}
      onCancel={onCancel}
      width={720}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Lưu thay đổi
        </Button>,
      ]}
      style={{
        ...(isMobile ? { top: "0" } : {}),
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isActive: true,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="barcode"
            label="Mã sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm!" }]}
          >
            <Input placeholder="Nhập mã sản phẩm" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category) => (
                <Option key={category.value} value={category.value}>
                  {category.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="unit"
            label="Đơn vị tính"
            rules={[{ required: true, message: "Vui lòng chọn đơn vị tính!" }]}
          >
            <Select
              placeholder="Chọn đơn vị tính"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input placeholder="Đơn vị khác" />
                    <Button type="text" icon={<PlusOutlined />} />
                  </Space>
                </>
              )}
            >
              {units.map((unit) => (
                <Option key={unit} value={unit}>
                  {unit}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán"
            rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
          >
            <InputNumber
              placeholder="Nhập giá bán"
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              addonAfter="đ"
            />
          </Form.Item>

          <Form.Item
            name="costPrice"
            label="Giá nhập"
            rules={[{ required: true, message: "Vui lòng nhập giá nhập!" }]}
          >
            <InputNumber
              placeholder="Nhập giá nhập"
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              addonAfter="đ"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho!" }]}
          >
            <InputNumber placeholder="Nhập số lượng tồn kho" min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Đang bán" unCheckedChildren="Ngừng bán" />
          </Form.Item>
        </div>

        <Form.Item name="upload" label="Hình ảnh sản phẩm">
          <Upload {...uploadProps} listType="picture-card" accept="image/*">
            {fileList.length >= 1 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
