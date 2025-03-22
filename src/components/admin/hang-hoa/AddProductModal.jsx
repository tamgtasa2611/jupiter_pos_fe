import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Upload, Button, Divider } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useMobileStyles } from "@atoms/common";

const { Option } = Select;
const { TextArea } = Input;

const AddProductModal = ({ visible, onCancel, onAdd, categories, isMobile }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const mobileStyles = useMobileStyles();

  // Mobile style configurations
  const mobileInputStyle = isMobile ? { ...mobileStyles.input } : {};
  const mobileSelectStyle = isMobile ? { ...mobileStyles.select } : {};
  const mobileSwitchStyle = isMobile ? { ...mobileStyles.switch } : {};
  const mobileFormItemStyle = isMobile ? { ...mobileStyles.formItem } : {};
  const mobileButtonStyle = isMobile ? { ...mobileStyles.button } : {};

  console.log(mobileStyles.input);
  

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Prepare data for submission
      const productData = {
        ...values,
        image: fileList.length > 0 ? fileList[0] : null,
      };

      onAdd(productData);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  // Upload image props
  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      // Check file type
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Vui lòng chỉ tải lên các file hình ảnh!");
        return Upload.LIST_IGNORE;
      }

      // Check file size
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Kích thước hình ảnh không được vượt quá 2MB!");
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
  };

  return (
    <Modal
      title="Thêm sản phẩm mới"
      open={visible}
      {...(!isMobile && { centered: true })}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Thêm sản phẩm"
      cancelText="Hủy"
      confirmLoading={loading}
      style={{
        ...(isMobile ? { top: "0" } : {}),
      }}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={handleCancel} style={isMobile ? mobileButtonStyle : {}}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={isMobile ? mobileButtonStyle : {}}
          >
            Thêm sản phẩm
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isActive: true,
        }}
        style={isMobile ? { fontSize: "16px" } : {}}
      >
        <Divider orientation="left">Thông tin cơ bản</Divider>

        <Form.Item
          name="barcode"
          label="Mã sản phẩm / Barcode"
          rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm!" }]}
          style={mobileFormItemStyle}
        >
          <Input placeholder="Nhập mã sản phẩm hoặc barcode" style={mobileInputStyle} />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          style={mobileFormItemStyle}
        >
          <Input placeholder="Nhập tên sản phẩm" style={mobileInputStyle} />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            style={mobileFormItemStyle}
          >
            <Select
              placeholder="Chọn danh mục"
              style={mobileSelectStyle}
              dropdownStyle={isMobile ? { fontSize: "16px" } : {}}
            >
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
            rules={[{ required: true, message: "Vui lòng nhập đơn vị tính!" }]}
            style={mobileFormItemStyle}
          >
            <Select
              placeholder="Chọn đơn vị tính"
              style={mobileSelectStyle}
              dropdownStyle={isMobile ? { fontSize: "16px" } : {}}
            >
              <Option value="Thùng">Thùng</Option>
              <Option value="Hộp">Hộp</Option>
              <Option value="Chai">Chai</Option>
              <Option value="Lốc">Lốc</Option>
              <Option value="Gói">Gói</Option>
              <Option value="Cái">Cái</Option>
              <Option value="Kg">Kg</Option>
              <Option value="Gram">Gram</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider orientation="left">Giá & Số lượng</Divider>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            name="costPrice"
            label="Giá nhập (VND)"
            rules={[{ required: true, message: "Vui lòng nhập giá nhập!" }]}
            style={mobileFormItemStyle}
          >
            <InputNumber
              min={0}
              step={1000}
              style={{ width: "100%", ...mobileInputStyle }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán (VND)"
            rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
            style={mobileFormItemStyle}
          >
            <InputNumber
              min={0}
              step={1000}
              style={{ width: "100%", ...mobileInputStyle }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho!" }]}
            style={mobileFormItemStyle}
          >
            <InputNumber min={0} style={{ width: "100%", ...mobileInputStyle }} placeholder="0" />
          </Form.Item>
        </div>

        <Divider orientation="left">Hình ảnh & Thông tin khác</Divider>

        <Form.Item name="image" label="Hình ảnh sản phẩm" style={mobileFormItemStyle}>
          <Upload {...uploadProps} listType="picture-card" maxCount={1}>
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
          label="Trạng thái"
          style={mobileFormItemStyle}
        >
          <Switch
            checkedChildren="Đang bán"
            unCheckedChildren="Ngừng bán"
            style={mobileSwitchStyle}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
