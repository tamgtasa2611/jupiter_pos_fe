import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Divider,
  message,
} from "antd";
import { useMobileStyles } from "@atoms/common";
import { getProductById } from "@requests/product";

const { Option } = Select;
const { TextArea } = Input;

const ViewProductModal = ({
  visible,
  onCancel,
  onEdit,
  productId,
  categories = [],
  isMobile,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const mobileStyles = useMobileStyles();

  const mobileInputStyle = { ...mobileStyles.input };
  const mobileSelectStyle = { ...mobileStyles.select };
  const mobileSwitchStyle = { ...mobileStyles.switch };
  const mobileFormItemStyle = { ...mobileStyles.formItem };
  const mobileButtonStyle = { ...mobileStyles.button };

  useEffect(() => {
    if (visible && productId) {
      setLoading(true);
      getProductById(productId)
        .then((product) => {
          console.log(product);

          // Set giá trị cho form
          form.setFieldsValue({
            productName: product.productName,
            productDescription: product.description,
            categoryIds: product.categoryList
              ? product.categoryList.map((c) => c.id)
              : [],
            productStatus: product.status === "ACTIVE",
          });
          setLoading(false);
        })
        .catch((error) => {
          message.error("Lỗi khi tải chi tiết sản phẩm", error);
          setLoading(false);
        });
    }
  }, [visible, productId, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productData = {
        productName: values.productName,
        description: values.productDescription,
        categoryIds: values.categoryIds || [],
        status: values.productStatus ? "ACTIVE" : "INACTIVE",
        image:
          fileList.length > 0
            ? fileList[0].url || fileList[0].response?.url
            : null,
      };
      await onEdit(productId, productData).then(() => {
        form.resetFields();
        setFileList([]);
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Chi tiết sản phẩm"
      open={visible}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onCancel();
      }}
      confirmLoading={loading}
      width="90vw"
      centered={!isMobile}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      style={isMobile ? { top: "0" } : {}}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ productStatus: true }}
      >
        <Form.Item
          name="productName"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input
            readOnly
            placeholder="Nhập tên sản phẩm"
            style={mobileInputStyle}
          />
        </Form.Item>
        <Form.Item name="productDescription" label="Mô tả sản phẩm">
          <TextArea
            readOnly
            rows={4}
            placeholder="Nhập mô tả sản phẩm"
            style={mobileInputStyle}
          />
        </Form.Item>
        <Form.Item name="categoryIds" label="Danh mục">
          <Select
            mode="multiple"
            placeholder="Chọn danh mục"
            style={mobileSelectStyle}
            disabled
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="productStatus"
          label="Trạng thái sản phẩm"
          valuePropName="checked"
        >
          <Switch
            disabled
            checkedChildren="Đang bán"
            unCheckedChildren="Ngừng bán"
            style={mobileSwitchStyle}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ViewProductModal;
