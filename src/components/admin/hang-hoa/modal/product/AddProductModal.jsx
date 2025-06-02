import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Button,
  Divider,
  DatePicker,
  message,
  Space,
  Flex,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMobileStyles } from "@atoms/common";
import CloudinaryImageUpload from "@/components/common/upload/CloudinaryImageUpload";
import { MAX_VARIANT_IMAGES } from "@/constants/product";

const { Option } = Select;
const { TextArea } = Input;

const AddProductModal = ({
  visible,
  onCancel,
  onAdd, // onAdd sẽ nhận payload gồm product + danh sách variants
  categories = [],
  units = [],
  attributes = [],
  isMobile,
  handleAddCategory,
  handleAddAttribute,
  handleAddUnit,
  handleCategorySubmit,
  handleAttributeSubmit,
  handleUnitSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const mobileStyles = useMobileStyles();

  const mobileInputStyle = { ...mobileStyles.input };
  const mobileSelectStyle = { ...mobileStyles.select };
  const mobileSwitchStyle = { ...mobileStyles.switch };
  const mobileFormItemStyle = { ...mobileStyles.formItem };
  const mobileButtonStyle = { ...mobileStyles.button };
  const [variantImages, setVariantImages] = useState([]); // mỗi phần tử là mảng url ảnh của 1 variant
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file) => {
    let src = file.url || file.thumbUrl;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(src);
    setPreviewVisible(true);
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

      // Thu thập dữ liệu biến thể (nhiều biến thể)
      const variantData = (values.variants || []).map((variant, idx) => ({
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
        // Dữ liệu ảnh chỉ là mảng URL đã được FE nhận ngay lúc upload
        imagePaths: variantImages[idx] || [],
      }));

      const payload = {
        ...productData,
        variants: variantData,
      };

      await onAdd(payload).then(() => {
        form.resetFields();
        setVariantImages([]);
      }); // Đảm bảo chờ onAdd hoàn thành trước khi reset loading
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Thêm sản phẩm mới"
        open={visible}
        width="90vw" // Giao diện ngang gần full màn hình
        centered={!isMobile}
        onCancel={() => {
          form.resetFields();

          setVariantImages([]);
          setLoading(false); // Reset loading khi modal tắt
          onCancel();
        }}
        footer={
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button
              onClick={() => {
                form.resetFields();
                setVariantImages([]);
                setLoading(false); // Reset loading khi bấm Hủy
                onCancel();
              }}
              style={isMobile ? mobileButtonStyle : {}}
            >
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
        style={{ ...(isMobile ? { top: "0" } : {}) }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            productStatus: true,
            variants: [{}], // Khởi tạo với 1 biến thể rỗng
          }}
          style={isMobile ? { fontSize: "16px" } : {}}
        >
          <Divider orientation="left">Thông tin sản phẩm</Divider>
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
            style={mobileFormItemStyle}
          >
            <Input placeholder="Nhập tên sản phẩm" style={mobileInputStyle} />
          </Form.Item>
          <Form.Item
            name="productDescription"
            label="Mô tả sản phẩm"
            style={mobileFormItemStyle}
          >
            <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
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
            style={mobileFormItemStyle}
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
                {fields.map(({ key, name, ...restField }, idx) => (
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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4>Biến thể {name + 1}</h4>
                      {fields.length > 1 && (
                        <DeleteOutlined
                          onClick={() => remove(name)}
                          style={{ color: "red" }}
                        />
                      )}
                    </Space>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, "costPrice"]}
                        label="Giá nhập (VND)"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá nhập!",
                          },
                        ]}
                        style={mobileFormItemStyle}
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
                        style={mobileFormItemStyle}
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
                          {
                            required: true,
                            message: "Vui lòng nhập số lượng!",
                          },
                        ]}
                        style={mobileFormItemStyle}
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
                        style={mobileFormItemStyle}
                      >
                        <Select
                          placeholder="Chọn đơn vị tính"
                          style={mobileSelectStyle}
                          options={units.map((unit) => ({
                            value: unit.id,
                            label: unit.name,
                          }))}
                          popupRender={(menu) => (
                            <>
                              {menu}
                              <Divider dashed style={{ margin: "4px 0" }} />
                              <Button type="link" block onClick={handleAddUnit}>
                                Thêm đơn vị mới
                              </Button>
                            </>
                          )}
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "sku"]}
                        label="SKU"
                        style={mobileFormItemStyle}
                      >
                        <Input
                          placeholder="Nhập SKU"
                          style={mobileInputStyle}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "variantBarcode"]}
                        label="Mã vạch"
                        style={mobileFormItemStyle}
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
                        style={mobileFormItemStyle}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "variantStatus"]}
                        label="Trạng thái biến thể"
                        valuePropName="checked"
                        initialValue={true}
                        style={mobileFormItemStyle}
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
                            (
                              {
                                key: attrKey,
                                name: attrName,
                                ...restAttrField
                              },
                              idx,
                            ) => (
                              <Flex
                                key={attrKey}
                                justify="space-between"
                                align="center"
                                gap={16}
                                style={{ marginBottom: 8 }}
                              >
                                <Form.Item
                                  {...restAttrField}
                                  label={`Thuộc tính ${idx + 1}`}
                                  name={[attrName, "attrId"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn thuộc tính",
                                    },
                                  ]}
                                  style={{
                                    flex: "1",
                                  }}
                                >
                                  <Select
                                    placeholder="Chọn thuộc tính"
                                    options={attributes.map((attr) => ({
                                      value: attr.id,
                                      label: attr.attributeName,
                                    }))}
                                    style={{
                                      flex: "1",
                                    }}
                                    popupRender={(menu) => (
                                      <>
                                        {menu}
                                        <Divider
                                          dashed
                                          style={{ margin: "4px 0" }}
                                        />
                                        <Button
                                          type="link"
                                          block
                                          onClick={handleAddAttribute}
                                        >
                                          Thêm thuộc tính mới
                                        </Button>
                                      </>
                                    )}
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restAttrField}
                                  name={[attrName, "attrValue"]}
                                  label={`Giá trị ${idx + 1}`}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng nhập giá trị",
                                    },
                                  ]}
                                  style={{
                                    flex: "1",
                                  }}
                                >
                                  <Input
                                    placeholder="Nhập giá trị"
                                    style={{
                                      flex: "1",
                                    }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...restAttrField}
                                  name={[attrName, "unitId"]}
                                  style={{
                                    flex: "1",
                                  }}
                                  label={`Đơn vị ${idx + 1}`}
                                >
                                  <Select
                                    placeholder="Chọn đơn vị"
                                    style={{
                                      flex: "1",
                                    }}
                                    options={units.map((unit) => ({
                                      value: unit.id,
                                      label: unit.name,
                                    }))}
                                    popupRender={(menu) => (
                                      <>
                                        {menu}
                                        <Divider
                                          dashed
                                          style={{ margin: "4px 0" }}
                                        />
                                        <Button
                                          type="link"
                                          block
                                          onClick={handleAddUnit}
                                        >
                                          Thêm đơn vị mới
                                        </Button>
                                      </>
                                    )}
                                  />
                                </Form.Item>
                                <DeleteOutlined
                                  style={{ color: "red" }}
                                  onClick={() => removeAttr(attrName)}
                                />
                              </Flex>
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
                    <Form.Item label="Hình ảnh" style={mobileFormItemStyle}>
                      <CloudinaryImageUpload
                        onUploaded={(url) => {
                          setVariantImages((prev) => {
                            const arr = [...prev];
                            // Lưu URL ảnh mới vào mảng cho biến thể tại vị trí idx
                            arr[idx] = arr[idx] ? [...arr[idx], url] : [url];
                            return arr;
                          });
                        }}
                        buttonText="Tải ảnh lên"
                        disabled={
                          variantImages[idx] &&
                          variantImages[idx].length >= MAX_VARIANT_IMAGES
                        }
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          marginTop: 8,
                        }}
                      >
                        {(variantImages[idx] || []).map((url, i) => (
                          <div key={i} style={{ position: "relative" }}>
                            <img
                              src={url}
                              alt="Ảnh biến thể"
                              style={{ width: 80, borderRadius: 8 }}
                              onClick={() => handlePreview({ url })}
                              className="cursor-pointer"
                            />
                            <Button
                              size="small"
                              danger
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                padding: 0,
                                width: 20,
                                height: 20,
                              }}
                              onClick={() => {
                                setVariantImages((prev) => {
                                  const arr = [...prev];
                                  arr[idx] = arr[idx].filter((_, j) => j !== i);
                                  return arr;
                                });
                              }}
                            >
                              <DeleteOutlined style={{ fontSize: 12 }} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Form.Item>
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
        </Form>
      </Modal>

      <Modal
        open={previewVisible}
        footer={null}
        centered
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default AddProductModal;
