import React, { useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load modal components
const AddProductModal = dynamic(() => import("./product/AddProductModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});
const EditProductModal = dynamic(() => import("./product/EditProductModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});
const EditProductVariantModal = dynamic(
  () => import("./variant/EditProductVariantModal"),
  { loading: () => <p>Đang tải dữ liệu...</p> },
);
const ViewProductModal = dynamic(() => import("./product/ViewProductModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});
const DeleteProductModal = dynamic(
  () => import("./product/DeleteProductModal"),
  {
    loading: () => <p>Đang tải dữ liệu...</p>,
  },
);
const ImportProductsModal = dynamic(
  () => import("./product/ImportProductsModal"),
  {
    loading: () => <p>Đang tải dữ liệu...</p>,
  },
);

const ModalManager = ({
  addProductModalVisible,
  editProductModalVisible, // state cho sửa product
  viewProductModalVisible,
  deleteModalVisible,
  importModalVisible,
  setAddProductModalVisible,
  setEditProductModalVisible, // setter cho modal sửa product
  setViewProductModalVisible,
  setDeleteModalVisible,
  setImportModalVisible,
  selectedProduct, // sử dụng để truyền thông tin cho cả 2 modal
  selectedVariant, // sử dụng để truyền thông tin cho modal sửa variant
  handleAddProduct,
  handleEditProduct, // hàm cập nhật product
  handleEditProductVariant, // hàm cập nhật product variant
  handleDeleteProduct,
  handleImportProducts,
  categories,
  reloadCategories,
  units,
  reloadUnits,
  attributes,
  reloadAttributes,
  isMobile,
  editVariantModalVisible, // state cho modal sửa variant
  setEditVariantModalVisible, // setter cho modal sửa variant
}) => {
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
      />

      {selectedProduct && (
        <>
          <EditProductModal
            visible={editProductModalVisible}
            onCancel={() => setEditProductModalVisible(false)}
            onEdit={handleEditProduct}
            productId={selectedProduct.id}
            categories={categories}
            isMobile={isMobile}
          />

          <ViewProductModal
            visible={viewProductModalVisible}
            onCancel={() => setViewProductModalVisible(false)}
            product={selectedProduct}
            isMobile={isMobile}
          />

          <DeleteProductModal
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onDelete={() => handleDeleteProduct(selectedProduct.id)}
            product={selectedProduct}
            isMobile={isMobile}
          />
        </>
      )}

      <ImportProductsModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onImport={handleImportProducts}
        isMobile={isMobile}
      />

      {selectedVariant && (
        <EditProductVariantModal
          visible={editVariantModalVisible}
          onCancel={() => setEditVariantModalVisible(false)}
          onEdit={handleEditProductVariant}
          variantId={selectedVariant.id} // có thể thay bằng selectedVariant.id nếu bạn có state riêng cho variant
          categories={categories}
          units={units}
          attributes={attributes}
          reloadCategories={reloadCategories}
          reloadUnits={reloadUnits}
          reloadAttributes={reloadAttributes}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default ModalManager;
