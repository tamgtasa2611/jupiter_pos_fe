import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Divider,
  App,
  Flex,
  Spin,
} from "antd";
import { useMobileStyles } from "@atoms/common";
import { getProductById } from "@requests/product";
import { DANG_BAN, NGUNG_BAN } from "@/constants/product";
const { Option } = Select;
const { TextArea } = Input;

const EditProductModal = ({
  visible,
  onCancel,
  onEdit,
  productId,
  categories = [],
  handleAddCategory,
  isMobile,
  setCategorySearchText,
  reloadCategories = () => {},
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const mobileStyles = useMobileStyles();
  const [formLoading, setFormLoading] = useState(true);

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
            productStatus: product.status === DANG_BAN,
          });
          setLoading(false);
          setFormLoading(false);
        })
        .catch((error) => {
          message.error("Lỗi khi tải chi tiết sản phẩm", error);
          setLoading(false);
          setFormLoading(false);
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
        status: values.productStatus ? DANG_BAN : NGUNG_BAN,
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
      maskClosable={false}
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
      {formLoading ? (
        <Flex justify="center" align="center" style={{ height: "100px" }}>
          <Spin size="large" />
        </Flex>
      ) : (
        form && (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ productStatus: true }}
          >
            <Form.Item
              name="productName"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
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
                showSearch
                filterOption={false}
                onSearch={(value) => {
                  setCategorySearchText(value);
                }}
                onInputKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    const searchValue = e.target.value;
                    if (searchValue && searchValue.trim() !== "") {
                      reloadCategories && reloadCategories(searchValue.trim());
                    } else {
                      reloadCategories && reloadCategories("");
                    }
                  }
                }}
                onBlur={() => {
                  setCategorySearchText("");
                  reloadCategories && reloadCategories("");
                }}
                popupRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Button
                      type="link"
                      block
                      onClick={() => {
                        handleAddCategory();
                      }}
                    >
                      + Thêm danh mục
                    </Button>
                  </>
                )}
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
                checkedChildren="Đang bán"
                unCheckedChildren="Ngừng bán"
                style={mobileSwitchStyle}
              />
            </Form.Item>
          </Form>
        )
      )}
    </Modal>
  );
};

export default EditProductModal;
