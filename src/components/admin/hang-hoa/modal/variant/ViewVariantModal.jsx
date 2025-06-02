import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Divider,
  message,
  DatePicker,
  Flex,
  Spin,
  Image,
} from "antd";

import dayjs from "dayjs";
import { getProductVariantById } from "@requests/product";
const { Option } = Select;

const ViewVariantModal = ({
  visible,
  onCancel,
  variantId,
  units = [],
  attributes = [],
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

  return (
    <Modal
      title="Chi tiết biến thể sản phẩm"
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
          Đóng
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
              readOnly
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
              readOnly
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber
              min={0}
              placeholder="0"
              style={{ width: "100%" }}
              readOnly
            />
          </Form.Item>
          <Form.Item name="unitId" label="Đơn vị tính">
            <Select placeholder="Chọn đơn vị tính" disabled>
              {units.map((unit) => (
                <Option key={unit.id} value={unit.id}>
                  {unit.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sku" label="SKU">
            <Input placeholder="Nhập SKU" readOnly />
          </Form.Item>
          <Form.Item name="variantBarcode" label="Mã vạch">
            <Input placeholder="Nhập mã vạch" readOnly />
          </Form.Item>
          <Form.Item name="expiryDate" label="Ngày hết hạn">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày hết hạn"
              disabled
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
              disabled
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
                        disabled
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
                      <Input
                        placeholder="Giá trị"
                        style={{ flex: 1 }}
                        readOnly
                      />
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
                        disabled
                      />
                    </Form.Item>
                  </Flex>
                ))}
              </>
            )}
          </Form.List>
          <Divider orientation="left">Hình ảnh biến thể</Divider>
          <Form.Item name="upload" label="Hình ảnh biến thể">
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
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ViewVariantModal;
