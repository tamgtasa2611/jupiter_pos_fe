import React, { useEffect, useState } from "react";
import { message } from "antd";
import dynamic from "next/dynamic";
import { createCategory } from "@requests/category"; // Import hàm tạo danh mục mới
import { createUnit } from "@requests/unit"; // Import hàm tạo đơn vị mới
import { createAttribute } from "@requests/attribute"; // Import hàm tạo thuộc tính mới
import AddCategoryModal from "./common/AddCategoryModal"; // Import modal thêm danh mục
import AddAttributeModal from "./common/AddAttributeModal";
import AddUnitModal from "./common/AddUnitModal";
import AddVariantModal from "./variant/AddVariantModal";

// Lazy load modal components
const AddProductModal = dynamic(() => import("./product/AddProductModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});
const ViewProductModal = dynamic(() => import("./product/ViewProductModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});

const EditProductModal = dynamic(() => import("./product/EditProductModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});
const ViewVariantModal = dynamic(() => import("./variant/ViewVariantModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});

const EditVariantModal = dynamic(() => import("./variant/EditVariantModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});

const ModalManager = ({
  addProductModalVisible,
  editProductModalVisible, // state cho sửa product
  viewProductModalVisible,
  addVariantModalVisible,
  importModalVisible,
  setAddProductModalVisible,
  setEditProductModalVisible, // setter cho modal sửa product
  setViewProductModalVisible,
  setAddVariantModalVisible,
  setImportModalVisible,
  selectedProductId, // sử dụng để truyền thông tin cho cả 2 modal
  selectedVariantId, // sử dụng để truyền thông tin cho modal sửa variant
  handleAddProduct,
  handleEditProduct, // hàm cập nhật product
  handleAddVariant, // hàm thêm variant
  handleEditProductVariant, // hàm cập nhật product variant
  handleUpdateProductStatus,
  handleImportProducts,
  categories,
  reloadCategories,
  units,
  reloadUnits,
  attributes,
  reloadAttributes,
  isMobile,
  viewVariantModalVisible, // state cho modal xem variant
  setViewVariantModalVisible,
  editVariantModalVisible, // state cho modal sửa variant
  setEditVariantModalVisible, // setter cho modal sửa variant
}) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  // Mở modal thêm danh mục
  const handleAddCategory = () => {
    setCategoryModalVisible(true);
  };

  // Xử lý submit modal danh mục
  const handleCategorySubmit = async (values) => {
    try {
      const res = await createCategory({ name: values.categoryName });
      if (!res || res?.error) {
        // Nếu có lỗi từ API, hiển thị thông báo lỗi
        message.error(res?.message || "Thêm danh mục thất bại!");
        return;
      } else {
        // Gọi API thêm danh mục mới với values.categoryName ở đây
        message.success("Danh mục mới được thêm thành công!");
        // Sau khi thêm mới thành công, bạn có thể cập nhật lại danh sách categories
        reloadCategories();
        setCategoryModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add category", error?.message);
      message.error(error?.message || "Thêm danh mục thất bại!");
    }
  };

  const handleAddAttribute = () => {
    setAttributeModalVisible(true);
  };

  const handleAttributeSubmit = async (values) => {
    try {
      const res = await createAttribute({ name: values.attributeName });
      if (!res || res?.error) {
        // Nếu có lỗi từ API, hiển thị thông báo lỗi
        message.error(res?.message || "Thêm thuộc tính thất bại!");
        return;
      } else {
        message.success("Thuộc tính mới được thêm thành công!");
        reloadAttributes();
        setAttributeModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add attribute", error?.message);
      message.error(error?.message || "Thêm thuộc tính thất bại!");
    }
  };

  const handleAddUnit = () => {
    setUnitModalVisible(true);
  };

  const handleUnitSubmit = async (values) => {
    try {
      const res = await createUnit({ name: values.unitName });
      if (!res || res?.error) {
        // Nếu có lỗi từ API, hiển thị thông báo lỗi
        message.error(res?.message || "Thêm đơn vị thất bại!");
        return;
      } else {
        message.success("Đơn vị mới được thêm thành công!");
        reloadUnits(); // Cập nhật lại danh sách đơn vị
        setUnitModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add unit", error?.message);
      message.error(error?.message || "Thêm đơn vị thất bại!");
    }
  };

  const props = {
    handleAddCategory: handleAddCategory,
    handleAddAttribute: handleAddAttribute,
    handleAddUnit: handleAddUnit,
    handleCategorySubmit: handleCategorySubmit,
    handleAttributeSubmit: handleAttributeSubmit,
    handleUnitSubmit: handleUnitSubmit,
  };

  return (
    <>
      <AddProductModal
        visible={addProductModalVisible}
        onCancel={() => setAddProductModalVisible(false)}
        onAdd={handleAddProduct}
        categories={categories}
        reloadCategories={reloadCategories}
        units={units}
        reloadUnits={reloadUnits}
        attributes={attributes}
        reloadAttributes={reloadAttributes}
        isMobile={isMobile}
        {...props}
      />

      {selectedProductId && (
        <>
          <EditProductModal
            visible={editProductModalVisible}
            onCancel={() => setEditProductModalVisible(false)}
            onEdit={handleEditProduct}
            productId={selectedProductId}
            categories={categories}
            reloadCategories={reloadCategories}
            isMobile={isMobile}
            {...props}
          />

          <ViewProductModal
            visible={viewProductModalVisible}
            onCancel={() => setViewProductModalVisible(false)}
            productId={selectedProductId}
            categories={categories}
            isMobile={isMobile}
          />

          <AddVariantModal
            visible={addVariantModalVisible}
            onCancel={() => setAddVariantModalVisible(false)}
            onAdd={handleAddVariant}
            productId={selectedProductId}
            categories={categories}
            units={units}
            handleAddUnit={handleAddUnit}
            attributes={attributes}
            handleAddAttribute={handleAddAttribute}
            isMobile={isMobile}
          />
        </>
      )}

      {selectedVariantId && (
        <>
          <ViewVariantModal
            visible={viewVariantModalVisible}
            onCancel={() => setViewVariantModalVisible(false)}
            variantId={selectedVariantId}
            units={units}
            attributes={attributes}
            isMobile={isMobile}
          />

          <EditVariantModal
            visible={editVariantModalVisible}
            onCancel={() => setEditVariantModalVisible(false)}
            onEdit={handleEditProductVariant}
            variantId={selectedVariantId}
            categories={categories}
            units={units}
            attributes={attributes}
            reloadCategories={reloadCategories}
            reloadUnits={reloadUnits}
            reloadAttributes={reloadAttributes}
            isMobile={isMobile}
            handleAddUnit={handleAddUnit}
            handleAddAttribute={handleAddAttribute}
          />
        </>
      )}

      {/* Modal thêm danh mục mới */}
      <AddCategoryModal
        visible={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        onOk={handleCategorySubmit}
      />

      <AddAttributeModal
        visible={attributeModalVisible}
        onCancel={() => setAttributeModalVisible(false)}
        onOk={handleAttributeSubmit}
      />

      <AddUnitModal
        visible={unitModalVisible}
        onCancel={() => setUnitModalVisible(false)}
        onOk={handleUnitSubmit}
      />
    </>
  );
};

export default ModalManager;
