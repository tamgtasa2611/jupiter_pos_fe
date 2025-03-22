"use client";

import React, { useState } from "react";
import {
  Modal,
  Upload,
  Button,
  Typography,
  Steps,
  Result,
  Alert,
  Table,
  Space,
  Tooltip,
} from "antd";
import {
  InboxOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;
const { Dragger } = Upload;
const { Step } = Steps;

const ImportProductsModal = ({ visible, onCancel, onImport }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileChange = (info) => {
    const { status } = info.file;

    if (status === "done") {
      setFileList([info.file]);

      // Mock preview data generation
      setTimeout(() => {
        const mockPreviewData = Array(5)
          .fill()
          .map((_, index) => ({
            key: index,
            barcode: `SP${String(100000 + index).substring(1)}`,
            name: `Sản phẩm nhập từ Excel ${index + 1}`,
            category: ["beverages", "food", "snacks"][Math.floor(Math.random() * 3)],
            price: Math.floor(Math.random() * 500000) + 10000,
            costPrice: Math.floor(Math.random() * 300000) + 5000,
            stock: Math.floor(Math.random() * 100) + 10,
            unit: ["Thùng", "Hộp", "Chai"][Math.floor(Math.random() * 3)],
          }));

        const mockErrors =
          index > 2
            ? [
                { row: 7, field: "barcode", message: "Mã sản phẩm đã tồn tại" },
                { row: 12, field: "price", message: "Giá bán không thể nhỏ hơn giá nhập" },
              ]
            : [];

        setPreviewData(mockPreviewData);
        setValidationErrors(mockErrors);
        setCurrentStep(1);
      }, 1500);
    } else if (status === "error") {
      console.error("Upload file failed");
    }

    setFileList(info.fileList.slice(-1));
  };

  const handleImport = () => {
    setUploading(true);

    // Mock import process
    setTimeout(() => {
      setUploading(false);
      setCurrentStep(2);
      onImport(previewData);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    // Logic to download the template
    console.log("Downloading template...");
  };

  const steps = [
    {
      title: "Tải file lên",
      content: (
        <>
          <div className="mb-4">
            <Title level={5}>Tải lên file Excel</Title>
            <Text className="text-gray-500">
              Vui lòng tải lên file Excel chứa thông tin sản phẩm theo mẫu
            </Text>
          </div>

          <div className="mb-4">
            <Alert
              message="Lưu ý"
              description={
                <div>
                  <p>- Đảm bảo dữ liệu đúng định dạng theo file mẫu</p>
                  <p>- Kích thước file không vượt quá 5MB</p>
                  <p>- Hỗ trợ định dạng .xlsx, .xls</p>
                </div>
              }
              type="info"
              showIcon
            />
          </div>

          <Dragger
            name="file"
            multiple={false}
            accept=".xlsx,.xls"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={(file) => {
              // Normally would validate file here
              return false; // Prevent auto upload
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả file hoặc click để tải lên</p>
            <p className="ant-upload-hint">Hỗ trợ định dạng .xlsx, .xls</p>
          </Dragger>

          <div className="flex justify-center mt-4">
            <Button type="link" icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
              Tải xuống file mẫu
            </Button>
          </div>
        </>
      ),
    },
    {
      title: "Xác nhận dữ liệu",
      content: (
        <>
          <div className="mb-4">
            <Title level={5}>Xem trước dữ liệu</Title>
            <Text className="text-gray-500">
              Vui lòng kiểm tra dữ liệu trước khi thực hiện nhập
            </Text>
          </div>

          {validationErrors.length > 0 && (
            <Alert
              message="Lỗi dữ liệu"
              description={
                <>
                  <p>Phát hiện một số lỗi trong dữ liệu. Vui lòng kiểm tra:</p>
                  <ul className="list-disc pl-5 mt-2">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-red-500">
                        Dòng {error.row}: {error.field} - {error.message}
                      </li>
                    ))}
                  </ul>
                </>
              }
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Table
            dataSource={previewData}
            rowKey="key"
            size="small"
            pagination={false}
            className="mb-4"
            scroll={{ x: 800 }}
            columns={[
              {
                title: "Mã sản phẩm",
                dataIndex: "barcode",
                key: "barcode",
              },
              {
                title: "Tên sản phẩm",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Danh mục",
                dataIndex: "category",
                key: "category",
              },
              {
                title: "Giá bán",
                dataIndex: "price",
                key: "price",
                render: (price) => new Intl.NumberFormat("vi-VN").format(price) + "đ",
              },
              {
                title: "Giá nhập",
                dataIndex: "costPrice",
                key: "costPrice",
                render: (price) => new Intl.NumberFormat("vi-VN").format(price) + "đ",
              },
              {
                title: "Tồn kho",
                dataIndex: "stock",
                key: "stock",
                render: (stock, record) => `${stock} ${record.unit}`,
              },
            ]}
          />

          <div className="flex items-center mb-2">
            <Text>
              Hiển thị 5 trên tổng số {previewData.length + Math.floor(Math.random() * 20)} sản phẩm
            </Text>
            <Tooltip title="Chỉ hiển thị 5 dòng đầu tiên để xem trước">
              <QuestionCircleOutlined className="ml-2 text-gray-400" />
            </Tooltip>
          </div>
        </>
      ),
    },
    {
      title: "Hoàn thành",
      content: (
        <Result
          icon={<CheckCircleOutlined className="text-green-500" />}
          title="Nhập dữ liệu thành công"
          subTitle={`Đã nhập ${previewData.length} sản phẩm vào hệ thống`}
          extra={
            <Button type="primary" onClick={onCancel}>
              Đóng
            </Button>
          }
        />
      ),
    },
  ];

  const modalFooter =
    currentStep === 2
      ? null
      : [
          <Button key="back" onClick={onCancel}>
            Hủy
          </Button>,
          currentStep === 0 && (
            <Button
              key="next"
              type="primary"
              disabled={fileList.length === 0}
              loading={fileList.length > 0 && currentStep === 0}
              onClick={() => {}}
            >
              Tiếp theo
            </Button>
          ),
          currentStep === 1 && (
            <Button
              key="import"
              type="primary"
              icon={<FileExcelOutlined />}
              loading={uploading}
              disabled={validationErrors.length > 0}
              onClick={handleImport}
            >
              Nhập hàng
            </Button>
          ),
        ];

  return (
    <Modal
      title="Nhập sản phẩm từ Excel"
      open={visible}
      onCancel={onCancel}
      footer={modalFooter}
      width={800}
    >
      <Steps
        current={currentStep}
        className="mb-6"
        items={steps.map((step) => ({ title: step.title }))}
      />
      <div className="p-2">{steps[currentStep].content}</div>
    </Modal>
  );
};

export default ImportProductsModal;
