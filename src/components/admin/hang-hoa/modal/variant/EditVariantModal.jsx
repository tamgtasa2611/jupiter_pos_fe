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
  DatePicker,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getProductVariantById, updateVariant } from "@requests/product";

const { Option } = Select;

const EditVariantModal = ({
  visible,
  onCancel,
  onEdit,
  variantId,
  categories = [],
  reloadCategories,
  units = [],
  reloadUnits,
  attributes = [],
  reloadAttributes,
  isMobile,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [productDetail, setProductDetail] = useState({});

  // Khi modal mở, gọi API và map dữ liệu vào form dưới dạng object variant
  useEffect(() => {
    if (visible && variantId) {
      setLoading(true);
      getProductVariantById(variantId)
        .then((detail) => {
          setProductDetail(detail);
          form.setFieldsValue({
            costPrice: detail.costPrice,
            price: detail.price,
            quantity: detail.quantity,
            unitId: detail.unitId,
            sku: detail.sku,
            variantBarcode: detail.barcode,
            expiryDate: detail.expiryDate ? dayjs(detail.expiryDate) : null,
            variantStatus: detail.status === "ACTIVE",
            attrAndValues: detail.attrValues
              ? detail.attrValues.map((av) => ({
                  attrId: av.attrId,
                  attrValue: av.attrValue,
                  unitId: av.unitId,
                }))
              : [],
          });
          if (detail.imagePaths && detail.imagePaths.length > 0) {
            setFileList([
              {
                uid: "-1",
                name: "product-image.jpg",
                status: "done",
                url: detail.imagePaths[0],
              },
            ]);
          } else {
            setFileList([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          message.error("Lỗi khi tải chi tiết biến thể");
          setLoading(false);
        });
    }
  }, [visible, variantId, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
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

      const payload = {
        costPrice: values.costPrice,
        price: values.price,
        quantity: values.quantity || 0,
        unitId: values.unitId,
        sku: values.sku,
        barcode: values.variantBarcode,
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
        status: values.variantStatus ? "ACTIVE" : "INACTIVE",
        attrAndValues: values.attrAndValues || [],
        imagePaths:
          fileList.length > 0
            ? [fileList[0].url || fileList[0].response?.url]
            : [],
      };

      await onEdit(variantId, payload);
      message.success("Cập nhật biến thể sản phẩm thành công");
      form.resetFields();
      setFileList([]);
      setLoading(false);
      onCancel();
    } catch (error) {
      console.error("Validation failed or API error:", error);
      message.error("Cập nhật biến thể sản phẩm thất bại");
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa biến thể sản phẩm"
      open={visible}
      maskClosable={false}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onCancel();
      }}
      width="90vw"
      {...(!isMobile && { centered: true })}
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
        initialValues={{ variantStatus: true }}
      >
        <Divider orientation="left">Thông tin biến thể</Divider>
        <Form.Item
          name="costPrice"
          label="Giá nhập (VND)"
          rules={[{ required: true, message: "Vui lòng nhập giá nhập!" }]}
        >
          <InputNumber
            min={0}
            step={1000}
            placeholder="0"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá bán (VND)"
          rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
        >
          <InputNumber
            min={0}
            step={1000}
            placeholder="0"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Số lượng tồn kho"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <InputNumber min={0} placeholder="0" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="unitId" label="Đơn vị tính">
          <Select placeholder="Chọn đơn vị tính">
            {units.map((unit) => (
              <Option key={unit.id} value={unit.id}>
                {unit.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="sku" label="SKU">
          <Input placeholder="Nhập SKU" />
        </Form.Item>
        <Form.Item name="variantBarcode" label="Mã vạch">
          <Input placeholder="Nhập mã vạch" />
        </Form.Item>
        <Form.Item name="expiryDate" label="Ngày hết hạn">
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Chọn ngày hết hạn"
          />
        </Form.Item>
        <Form.Item
          name="variantStatus"
          label="Trạng thái biến thể"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Đang bán"
            unCheckedChildren="Ngừng bán"
            defaultChecked
          />
        </Form.Item>
        <Divider orientation="left">Thuộc tính biến thể</Divider>
        <Form.List name="attrAndValues">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ marginBottom: 8 }}>
                  <Form.Item
                    {...restField}
                    name={[name, "attrId"]}
                    rules={[{ required: true, message: "Chọn thuộc tính" }]}
                  >
                    <Select
                      placeholder="Chọn thuộc tính"
                      style={{ width: 240 }}
                      options={attributes.map((attr) => ({
                        value: attr.id,
                        label: attr.attributeName,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "attrValue"]}
                    rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
                  >
                    <Input placeholder="Giá trị" style={{ width: 240 }} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "unitId"]}>
                    <Select
                      placeholder="Đơn vị"
                      style={{ width: 200 }}
                      options={units.map((unit) => ({
                        value: unit.id,
                        label: unit.name,
                      }))}
                    />
                  </Form.Item>
                  <DeleteOutlined
                    style={{ color: "red" }}
                    onClick={() => remove(name)}
                  />
                </Space>
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
        <Form.Item name="upload" label="Hình ảnh biến thể">
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

export default EditVariantModal;
