import React, { useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load modal components
const AddProductModal = dynamic(() => import("./AddProductModal"), {
  loading: () => <p>Loading...</p>,
});
const EditProductModal = dynamic(() => import("./EditProductModal"), {
  loading: () => <p>Loading...</p>,
});
const EditProductVariantModal = dynamic(
  () => import("./EditProductVariantModal"),
  { loading: () => <p>Loading...</p> },
);
const ViewProductModal = dynamic(() => import("../ViewProductModal"), {
  loading: () => <p>Loading...</p>,
});
const DeleteProductModal = dynamic(() => import("./DeleteProductModal"), {
  loading: () => <p>Loading...</p>,
});
const ImportProductsModal = dynamic(() => import("./ImportProductsModal"), {
  loading: () => <p>Loading...</p>,
});

const ModalManager = ({
  addModalVisible,
  editModalVisible, // state cho sửa product
  viewModalVisible,
  deleteModalVisible,
  importModalVisible,
  setAddModalVisible,
  setEditModalVisible, // setter cho modal sửa product
  setViewModalVisible,
  setDeleteModalVisible,
  setImportModalVisible,
  selectedProduct, // sử dụng để truyền thông tin cho cả 2 modal
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
  useEffect(() => {
    console.log("selectedProduct:", selectedProduct);
    console.log("editProductModalVisible:", editModalVisible);
    console.log("editVariantModalVisible:", editVariantModalVisible);
  }, [selectedProduct, editModalVisible, editVariantModalVisible]);
  return (
    <>
      <AddProductModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
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
            visible={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onEdit={handleEditProduct}
            productId={selectedProduct.id}
            categories={categories}
            isMobile={isMobile}
          />

          <EditProductVariantModal
            visible={editVariantModalVisible}
            onCancel={() => setEditVariantModalVisible(false)}
            onEdit={handleEditProductVariant}
            productId={selectedProduct.id} // có thể thay bằng selectedVariant.id nếu bạn có state riêng cho variant
            categories={categories}
            units={units}
            attributes={attributes}
            reloadCategories={reloadCategories}
            reloadUnits={reloadUnits}
            reloadAttributes={reloadAttributes}
            isMobile={isMobile}
          />

          <ViewProductModal
            visible={viewModalVisible}
            onCancel={() => setViewModalVisible(false)}
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
    </>
  );
};

export default ModalManager;
