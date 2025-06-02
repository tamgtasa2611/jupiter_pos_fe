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
  Flex,
  Spin,
  Image,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getProductVariantById, updateVariant } from "@requests/product";
import CloudinaryImageUpload from "@/components/common/upload/CloudinaryImageUpload";
import { MAX_VARIANT_IMAGES } from "@/constants/product";

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
  const [formLoading, setFormLoading] = useState(true);
  const [variantImages, setVariantImages] = useState([]);

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
          // Nếu có ảnh thì set vào variantImages
          if (detail.imagePaths && detail.imagePaths.length > 0) {
            setVariantImages(detail.imagePaths);
          } else {
            setVariantImages([]);
          }
          setLoading(false);
          setFormLoading(false);
        })
        .catch((error) => {
          message.error("Lỗi khi tải chi tiết biến thể");
          setLoading(false);
          setFormLoading(false);
        });
    }
  }, [visible, variantId, form]);

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
        imagePaths: variantImages,
      };

      await onEdit(variantId, payload);
      message.success("Cập nhật biến thể sản phẩm thành công");
      form.resetFields();
      setVariantImages([]);
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
        setVariantImages([]);
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
      {formLoading ? (
        <Flex justify="center" align="center" style={{ height: "100px" }}>
          <Spin size="large" />
        </Flex>
      ) : (
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
                {fields.map(({ key, name, ...restField }, idx) => (
                  <Flex
                    key={key}
                    justify="space-between"
                    align="center"
                    gap={8}
                    style={{ marginBottom: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "attrId"]}
                      label={`Thuộc tính ${idx + 1}`}
                      rules={[
                        { required: true, message: "Vui lòng chọn thuộc tính" },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Select
                        placeholder="Chọn thuộc tính"
                        style={{ flex: 1 }}
                        options={attributes.map((attr) => ({
                          value: attr.id,
                          label: attr.attributeName,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "attrValue"]}
                      style={{ flex: 1 }}
                      label={`Giá trị ${idx + 1}`}
                      rules={[
                        { required: true, message: "Vui lòng nhập giá trị" },
                      ]}
                    >
                      <Input placeholder="Giá trị" style={{ flex: 1 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label={`Đơn vị ${idx + 1}`}
                      style={{ flex: 1 }}
                      name={[name, "unitId"]}
                    >
                      <Select
                        placeholder="Đơn vị"
                        style={{ flex: 1 }}
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
          <Form.Item name="upload" label="Hình ảnh biến thể">
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
                    src={url}
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
      )}
    </Modal>
  );
};

export default EditVariantModal;
