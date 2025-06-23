import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  DatePicker,
  Divider,
  Space,
  message,
  Flex,
  Image,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CloudinaryImageUpload from "@/components/common/upload/CloudinaryImageUpload";
import { useMobileStyles } from "@atoms/common";
import { MAX_VARIANT_IMAGES, DANG_BAN, NGUNG_BAN } from "@/constants/product";
const { Option } = Select;

const AddVariantModal = ({
  visible,
  onCancel,
  onAdd,
  productId,
  units = [],
  handleAddUnit,
  attributes = [],
  handleAddAttribute,
  isMobile,
  setUnitSearchText,
  setAttributeSearchText,
  reloadUnits = () => {},
  reloadAttributes = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const mobileStyles = useMobileStyles();
  const mobileInputStyle = { ...mobileStyles.input };
  const mobileSelectStyle = { ...mobileStyles.select };
  const mobileSwitchStyle = { ...mobileStyles.switch };
  const mobileFormItemStyle = { ...mobileStyles.formItem };
  const mobileButtonStyle = { ...mobileStyles.button };

  // State lưu URL hình ảnh của variant
  const [variantImages, setVariantImages] = useState([]);

  const handleUpload = (url) => {
    setVariantImages((prev) => {
      const newImages = [...prev];
      if (newImages.length < MAX_VARIANT_IMAGES) {
        newImages.push(url);
      }
      return newImages;
    });
  };

  const handleRemoveImage = (idxToRemove) => {
    setVariantImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const variantData = {
        costPrice: values.costPrice,
        price: values.price,
        quantity: values.quantity || 0,
        unitId: values.unitId,
        sku: values.sku,
        barcode: values.variantBarcode,
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
        status: values.variantStatus ? DANG_BAN : NGUNG_BAN,
        attrAndValues: values.attrAndValues || [],
        imagePaths: variantImages, // Chỉ là mảng URL ảnh
      };
      await onAdd(productId, variantData);
      message.success("Thêm biến thể thành công");
      form.resetFields();
      setVariantImages([]);
      onCancel();
    } catch (error) {
      console.error("Thêm biến thể thất bại:", error);
      message.error("Thêm biến thể thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm biến thể sản phẩm"
      open={visible}
      onCancel={() => {
        form.resetFields();
        setVariantImages([]);
        onCancel();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            setVariantImages([]);
            onCancel();
          }}
          style={isMobile ? mobileButtonStyle : {}}
        >
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          style={isMobile ? mobileButtonStyle : {}}
        >
          Thêm biến thể
        </Button>,
      ]}
      width="90vw"
      centered={!isMobile}
      style={isMobile ? { top: "0" } : {}}
    >
      <Form form={form} layout="vertical">
        <Divider orientation="left">Thông tin biến thể</Divider>
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
            placeholder="0"
          />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Số lượng tồn kho"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          style={mobileFormItemStyle}
        >
          <InputNumber
            min={0}
            style={{ width: "100%", ...mobileInputStyle }}
            placeholder="0"
          />
        </Form.Item>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="unitId"
            label="Đơn vị tính"
            style={mobileFormItemStyle}
          >
            <Select
              placeholder="Chọn đơn vị tính"
              style={mobileSelectStyle}
              showSearch
              filterOption={false}
              onSearch={(value) => {
                setUnitSearchText(value);
              }}
              onInputKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  const searchValue = e.target.value;
                  if (searchValue && searchValue.trim() !== "") {
                    reloadUnits && reloadUnits(searchValue.trim());
                  } else {
                    reloadUnits && reloadUnits("");
                  }
                }
              }}
              onBlur={() => {
                setUnitSearchText("");
                reloadUnits && reloadUnits("");
              }}
              popupRender={(menu) => (
                <>
                  {menu}
                  <Divider dashed style={{ margin: "4px 0" }} />
                  <Button type="link" block onClick={handleAddUnit}>
                    Thêm đơn vị mới
                  </Button>
                </>
              )}
            >
              {units.map((unit) => (
                <Option key={unit.id} value={unit.id}>
                  {unit.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sku" label="SKU" style={mobileFormItemStyle}>
            <Input placeholder="Nhập SKU" style={mobileInputStyle} />
          </Form.Item>
        </div>
        <Form.Item
          name="variantBarcode"
          label="Mã vạch"
          style={mobileFormItemStyle}
        >
          <Input placeholder="Nhập mã vạch" style={mobileInputStyle} />
        </Form.Item>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="expiryDate"
            label="Ngày hết hạn"
            style={mobileFormItemStyle}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày hết hạn"
            />
          </Form.Item>
          <Form.Item
            name="variantStatus"
            label="Trạng thái biến thể"
            valuePropName="checked"
            style={mobileFormItemStyle}
            initialValue={true}
          >
            <Switch
              checkedChildren="Đang bán"
              unCheckedChildren="Ngừng bán"
              style={mobileSwitchStyle}
            />
          </Form.Item>
        </div>
        <Form.List name="attrAndValues">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, idx) => (
                <Flex
                  key={key}
                  justify="space-between"
                  align="center"
                  gap={16}
                  style={{ marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    label={`Thuộc tính ${idx + 1}`}
                    name={[name, "attrId"]}
                    style={{
                      flex: "1",
                      ...mobileSelectStyle,
                    }}
                    rules={[
                      { required: true, message: "Vui lòng chọn thuộc tính" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn thuộc tính"
                      showSearch
                      filterOption={false}
                      onSearch={(value) => {
                        setAttributeSearchText(value);
                      }}
                      onInputKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          const searchValue = e.target.value;
                          if (searchValue && searchValue.trim() !== "") {
                            reloadAttributes &&
                              reloadAttributes(searchValue.trim());
                          } else {
                            reloadAttributes && reloadAttributes("");
                          }
                        }
                      }}
                      onBlur={() => {
                        setAttributeSearchText("");
                        reloadAttributes && reloadAttributes("");
                      }}
                      style={{
                        flex: "1",
                        ...mobileSelectStyle,
                      }}
                      popupRender={(menu) => (
                        <>
                          {menu}
                          <Divider dashed style={{ margin: "4px 0" }} />
                          <Button
                            type="link"
                            block
                            onClick={handleAddAttribute}
                          >
                            Thêm thuộc tính mới
                          </Button>
                        </>
                      )}
                      options={attributes.map((attr) => ({
                        value: attr.id,
                        label: attr.attributeName,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label={`Giá trị ${idx + 1}`}
                    name={[name, "attrValue"]}
                    style={{
                      flex: "1",
                      ...mobileSelectStyle,
                    }}
                    rules={[
                      { required: true, message: "Vui lòng nhập giá trị" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập giá trị"
                      style={{
                        flex: "1",
                        ...mobileSelectStyle,
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label={`Đơn vị ${idx + 1}`}
                    style={{
                      flex: "1",
                      ...mobileSelectStyle,
                    }}
                    name={[name, "unitId"]}
                  >
                    <Select
                      placeholder="Chọn đơn vị"
                      showSearch
                      filterOption={false}
                      onSearch={(value) => {
                        setUnitSearchText(value);
                      }}
                      onInputKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          const searchValue = e.target.value;
                          if (searchValue && searchValue.trim() !== "") {
                            reloadUnits && reloadUnits(searchValue.trim());
                          } else {
                            reloadUnits && reloadUnits("");
                          }
                        }
                      }}
                      onBlur={() => {
                        setUnitSearchText("");
                        reloadUnits && reloadUnits("");
                      }}
                      popupRender={(menu) => (
                        <>
                          {menu}
                          <Divider dashed style={{ margin: "4px 0" }} />
                          <Button type="link" block onClick={handleAddUnit}>
                            Thêm đơn vị mới
                          </Button>
                        </>
                      )}
                      options={units.map((unit) => ({
                        value: unit.id,
                        label: unit.name,
                      }))}
                      style={{
                        flex: "1",
                        ...mobileSelectStyle,
                      }}
                    />
                  </Form.Item>
                  <DeleteOutlined
                    style={{ color: "red" }}
                    onClick={() => remove(name)}
                  />
                </Flex>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm thuộc tính
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider orientation="left">Hình ảnh biến thể</Divider>
        <Form.Item label="Hình ảnh" style={mobileFormItemStyle}>
          <CloudinaryImageUpload
            onUploaded={(url) => handleUpload(url)}
            buttonText="Tải ảnh lên"
            disabled={variantImages.length >= MAX_VARIANT_IMAGES}
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            {variantImages.map((url, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <Image
                  src={url || null}
                  alt="Ảnh biến thể"
                  style={{ width: 80, borderRadius: 8 }}
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
                  onClick={() => handleRemoveImage(idx)}
                >
                  <DeleteOutlined style={{ fontSize: 12 }} />
                </Button>
              </div>
            ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVariantModal;
