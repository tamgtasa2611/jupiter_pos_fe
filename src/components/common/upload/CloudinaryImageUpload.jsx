import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "@utils/utils";

const CLOUDINARY_UPLOAD_PRESET = "my_preset";
const CLOUDINARY_CLOUD_NAME = "dydv1jwq2";
const CLOUDINARY_API_KEY = "937698538284846";
const CLOUDINARY_API_SECRECT = "sc3NtNEEkFJzXdCCe-a8lI8e64I";
const CLOUDINARY_API_ENV =
  "CLOUDINARY_URL=cloudinary://937698538284846:sc3NtNEEkFJzXdCCe-a8lI8e64I@dydv1jwq2";

const CloudinaryImageUpload = ({
  onUploaded,
  buttonText = "Tải ảnh lên",
  disabled,
}) => {
  const [uploading, setUploading] = useState(false);

  const customRequest = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("tags", "temporary"); // Gán tag temporary
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      if (data.secure_url) {
        message.success("Tải ảnh lên thành công!");
        onUploaded && onUploaded(data.secure_url);
        onSuccess();
      } else {
        throw new Error("Upload thất bại");
      }
    } catch (err) {
      message.error("Tải ảnh lên thất bại!");
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Upload
      customRequest={customRequest}
      showUploadList={false}
      accept="image/*"
    >
      <Button
        hidden={disabled}
        icon={uploading ? <LoadingOutlined /> : <PlusOutlined />}
        loading={uploading}
      >
        {buttonText}
      </Button>
    </Upload>
  );
};

export default CloudinaryImageUpload;
