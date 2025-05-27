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
import { getProductVariantById } from "@requests/product";
import AddCategoryModal from "./AddCategoryModal"; // Import modal thêm danh mục
import { createCategory } from "@requests/category"; // Import hàm tạo danh mục mới
import { createUnit } from "@requests/unit"; // Import hàm tạo đơn vị mới
import { createAttribute } from "@requests/attribute"; // Import hàm tạo thuộc tính mới
import AddAttributeModal from "./AddAttributeModal";
import AddUnitModal from "./AddUnitModal";

const { Option } = Select;
const { TextArea } = Input;

const EditProductModal = ({
  visible,
  onCancel,
  onEdit,
  productId,
  categories = [],
  reloadCategories,
  units = [],
  reloadUnits,
  attributes = [],
  reloadAttributes,
  isMobile,
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

  // Khi modal bật, gọi API lấy chi tiết sản phẩm và map theo cấu trúc data.json
  useEffect(() => {
    if (visible && productId) {
      setLoading(true);
      getProductVariantById(productId)
        .then((detail) => {
          // Map dữ liệu từ API:
          // - Thông tin sản phẩm nằm trong detail.product
          // - Các thông tin biến thể được lấy từ các field như costPrice, price, quantity,...
          // - Mảng attrValues được map sang attrAndValues (ở đây đặt attrId là attrName vì API không trả về id)
          setProductDetail(detail);
          form.setFieldsValue({
            productName: detail.product.productName,
            productDescription: detail.product.description,
            categoryIds: detail.product.category
              ? detail.product.category.map((c) => c.id)
              : [],
            productStatus: true, // giả sử luôn ACTIVE
            variants: [
              {
                costPrice: detail.costPrice,
                price: detail.price,
                quantity: detail.quantity,
                unitId: detail.unitId,
                sku: detail.sku,
                variantBarcode: detail.barcode,
                expiryDate: detail.expiryDate ? dayjs(detail.expiryDate) : null,
                variantStatus: true,
                attrAndValues: detail.attrValues
                  ? detail.attrValues.map((av) => ({
                      attrId: av.attrName, // chuyển attrName thành attrId (do API không trả về id)
                      attrValue: av.attrValue,
                      unitId: undefined,
                    }))
                  : [],
              },
            ],
          });
          // Nếu detail có trường image, cập nhật fileList
          if (detail.image) {
            setFileList([
              {
                uid: "-1",
                name: "product-image.jpg",
                status: "done",
                url: detail.image,
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

  // Mở modal thêm danh mục
  const handleAddCategory = () => {
    setCategoryModalVisible(true);
  };

  // Xử lý submit modal danh mục
  const handleCategorySubmit = async (values) => {
    try {
      const res = await createCategory({ name: values.categoryName });
      if (res) {
        // Gọi API thêm danh mục mới với values.categoryName ở đây
        message.success("Danh mục mới được thêm thành công!");
        // Sau khi thêm mới thành công, bạn có thể cập nhật lại danh sách categories
        reloadCategories();
        setCategoryModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add category", error);
      message.error("Thêm danh mục thất bại!");
    }
  };

  const handleAddAttribute = () => {
    setAttributeModalVisible(true);
  };

  const handleAttributeSubmit = async (values) => {
    try {
      const res = await createAttribute({ name: values.attributeName });
      if (res) {
        message.success("Thuộc tính mới được thêm thành công!");
        reloadAttributes();
        setAttributeModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add attribute", error);
      message.error("Thêm thuộc tính thất bại!");
    }
  };

  const handleAddUnit = () => {
    setUnitModalVisible(true);
  };

  const handleUnitSubmit = async (values) => {
    try {
      const res = await createUnit({ name: values.unitName });
      if (res) {
        message.success("Đơn vị mới được thêm thành công!");
        reloadUnits(); // Cập nhật lại danh sách đơn vị
        setUnitModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add unit", error);
      message.error("Thêm đơn vị thất bại!");
    }
  };

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
      setLoading(true);
      const values = await form.validateFields();
      const productData = {
        productName: values.productName,
        description: values.productDescription,
        categoryIds: values.categoryIds || [],
        status: values.productStatus ? "ACTIVE" : "INACTIVE",
      };
      const variantData = (values.variants || []).map((variant) => ({
        costPrice: variant.costPrice,
        price: variant.price,
        quantity: variant.quantity || 0,
        unitId: variant.unitId,
        sku: variant.sku,
        barcode: variant.variantBarcode,
        expiryDate: variant.expiryDate
          ? variant.expiryDate.toISOString()
          : null,
        status: variant.variantStatus ? "ACTIVE" : "INACTIVE",
        attrAndValues: variant.attrAndValues || [],
      }));
      const payload = {
        ...productData,
        variants: variantData,
        image:
          fileList.length > 0
            ? fileList[0].url || fileList[0].response?.url
            : null,
      };
      await onEdit(productDetail.product.productId || null, payload);
      form.resetFields();
      setFileList([]);
      setLoading(false);
    } catch (error) {
      console.error("Validation failed:", error);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa sản phẩm"
      open={visible}
      {...(!isMobile && { centered: true })}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onCancel();
      }}
      width="90vw"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </Button>,
      ]}
      style={isMobile ? { top: "0" } : {}}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ productStatus: true, variants: [{}] }}
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

        <Form.Item
          name="categoryIds"
          label="Danh mục"
          style={mobileFormItemStyle}
        >
          <Select
            mode="multiple"
            placeholder="Chọn danh mục"
            style={mobileSelectStyle}
            allowClear
            popupRender={(menu) => (
              <>
                {menu}
                <Divider dashed style={{ margin: "8px 0" }} />
                <Button type="link" block onClick={handleAddCategory}>
                  Thêm danh mục
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
            checkedChildren="ACTIVE"
            unCheckedChildren="INACTIVE"
            style={mobileSwitchStyle}
          />
        </Form.Item>

        <Divider orientation="left">Thông tin biến thể sản phẩm</Divider>
        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    border: "1px solid #f0f0f0",
                    padding: 16,
                    marginBottom: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Space
                    align="baseline"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4>Biến thể {name + 1}</h4>
                    {fields.length > 1 && (
                      <Button danger onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    )}
                  </Space>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, "costPrice"]}
                      label="Giá nhập (VND)"
                      rules={[
                        { required: true, message: "Vui lòng nhập giá nhập!" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        step={1000}
                        style={{ width: "100%", ...mobileInputStyle }}
                        placeholder="0"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      label="Giá bán (VND)"
                      rules={[
                        { required: true, message: "Vui lòng nhập giá bán!" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        step={1000}
                        style={{ width: "100%", ...mobileInputStyle }}
                        placeholder="0"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      label="Số lượng tồn kho"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng!" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%", ...mobileInputStyle }}
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, "unitId"]}
                      label="Đơn vị tính"
                    >
                      <Select
                        placeholder="Chọn đơn vị tính"
                        style={mobileSelectStyle}
                      >
                        {units.map((unit) => (
                          <Option key={unit.id} value={unit.id}>
                            {unit.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "sku"]} label="SKU">
                      <Input placeholder="Nhập SKU" style={mobileInputStyle} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "variantBarcode"]}
                      label="Mã vạch"
                    >
                      <Input
                        placeholder="Nhập mã vạch"
                        style={mobileInputStyle}
                      />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, "expiryDate"]}
                      label="Ngày hết hạn"
                    >
                      <Input
                        placeholder="Nhập ngày hết hạn"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "variantStatus"]}
                      label="Trạng thái biến thể"
                      valuePropName="checked"
                    >
                      <Switch
                        checkedChildren="Đang bán"
                        unCheckedChildren="Ngừng bán"
                        style={mobileSwitchStyle}
                        defaultChecked
                      />
                    </Form.Item>
                  </div>
                  <Form.List name={[name, "attrAndValues"]}>
                    {(attrFields, { add: addAttr, remove: removeAttr }) => (
                      <>
                        {attrFields.map(
                          ({
                            key: attrKey,
                            name: attrName,
                            ...restAttrField
                          }) => (
                            <Space
                              key={attrKey}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restAttrField}
                                name={[attrName, "attrId"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Chọn thuộc tính",
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="Chọn thuộc tính"
                                  style={{ width: 240 }}
                                >
                                  {attributes.map((attr) => (
                                    <Option key={attr.id} value={attr.id}>
                                      {attr.attributeName}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restAttrField}
                                name={[attrName, "attrValue"]}
                                rules={[
                                  { required: true, message: "Nhập giá trị" },
                                ]}
                              >
                                <Input
                                  placeholder="Giá trị"
                                  style={{ width: 240 }}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restAttrField}
                                name={[attrName, "unitId"]}
                              >
                                <Select
                                  placeholder="Đơn vị"
                                  style={{ width: 200 }}
                                >
                                  {units.map((unit) => (
                                    <Option key={unit.id} value={unit.id}>
                                      {unit.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Button
                                danger
                                onClick={() => removeAttr(attrName)}
                              >
                                Xóa
                              </Button>
                            </Space>
                          ),
                        )}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => addAttr()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Thêm thuộc tính
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm biến thể
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Hình ảnh sản phẩm</Divider>
        <Form.Item
          name="upload"
          label="Hình ảnh sản phẩm"
          style={mobileFormItemStyle}
        >
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
          <TextArea
            rows={4}
            placeholder="Nhập mô tả sản phẩm"
            style={mobileInputStyle}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
