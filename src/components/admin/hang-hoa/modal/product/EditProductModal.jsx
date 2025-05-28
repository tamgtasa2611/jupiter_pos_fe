import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Switch,
  Button,
  Divider,
  Space,
  message,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useMobileStyles } from "@atoms/common";
import dayjs from "dayjs";
import { getProductById } from "@requests/product";

const { Option } = Select;
const { TextArea } = Input;

const EditProductModal = ({
  visible,
  onCancel,
  onEdit,
  productId,
  categories = [],
  reloadCategories,
  isMobile,
  handleAddCategory,
  handleAddAttribute,
  handleAddUnit,
  handleCategorySubmit,
  handleAttributeSubmit,
  handleUnitSubmit,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [productDetail, setProductDetail] = useState({});
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
          // Nếu có ảnh, cập nhật fileList
          if (product.image) {
            setFileList([
              {
                uid: "-1",
                name: "image.jpg",
                status: "done",
                url: product.image,
              },
            ]);
          } else {
            setFileList([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          message.error("Lỗi khi tải chi tiết sản phẩm");
          setLoading(false);
        });
    }
  }, [visible, productId, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Vui lòng tải lên hình ảnh!");
        return false;
      }
      return true;
    },
    fileList,
    onChange: handleUploadChange,
    maxCount: 1,
  };

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
      title="Chỉnh sửa sản phẩm"
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
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Lưu thay đổi
        </Button>,
      ]}
      style={isMobile ? { top: "0" } : {}}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ productStatus: true }}
      >
        <Divider orientation="left">Thông tin sản phẩm</Divider>
        <Form.Item
          name="productName"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" style={mobileInputStyle} />
        </Form.Item>
        <Form.Item name="productDescription" label="Mô tả sản phẩm">
          <TextArea
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
            allowClear
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
            checkedChildren="ACTIVE"
            unCheckedChildren="INACTIVE"
            style={mobileSwitchStyle}
          />
        </Form.Item>
        <Divider orientation="left">Hình ảnh sản phẩm</Divider>
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
      </Form>
    </Modal>
  );
};

export default EditProductModal;
