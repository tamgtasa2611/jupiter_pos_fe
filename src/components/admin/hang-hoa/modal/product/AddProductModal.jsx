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
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMobileStyles } from "@atoms/common";

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
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const mobileStyles = useMobileStyles();

  const mobileInputStyle = { ...mobileStyles.input };
  const mobileSelectStyle = { ...mobileStyles.select };
  const mobileSwitchStyle = { ...mobileStyles.switch };
  const mobileFormItemStyle = { ...mobileStyles.formItem };
  const mobileButtonStyle = { ...mobileStyles.button };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Vui lòng chỉ tải lên các file hình ảnh!");
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Kích thước hình ảnh không được vượt quá 2MB!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
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
        imagePaths: fileList.length > 0 ? [fileList[0].name] : [],
      }));

      const payload = {
        ...productData,
        variants: variantData,
      };

      await onAdd(payload).then(() => {
        form.resetFields();
        setFileList([]);
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
          setFileList([]);
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
                setFileList([]);
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
                                    options={attributes.map((attr) => ({
                                      value: attr.id,
                                      label: attr.attributeName,
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
          <Form.Item name="image" label="Hình ảnh" style={mobileFormItemStyle}>
            <Upload {...uploadProps} listType="picture-card" maxCount={1}>
              {fileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProductModal;
