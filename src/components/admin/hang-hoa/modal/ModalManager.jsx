import React from "react";
import dynamic from "next/dynamic";

// Lazy load modal components
const AddProductModal = dynamic(() => import("./AddProductModal"), {
  loading: () => <p>Loading...</p>,
});
const EditProductModal = dynamic(() => import("./EditProductModal"), {
  loading: () => <p>Loading...</p>,
});
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
  editModalVisible,
  viewModalVisible,
  deleteModalVisible,
  importModalVisible,
  setAddModalVisible,
  setEditModalVisible,
  setViewModalVisible,
  setDeleteModalVisible,
  setImportModalVisible,
  selectedProduct,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleImportProducts,
  categories,
  reloadCategories,
  units,
  reloadUnits,
  attributes,
  reloadAttributes,
  isMobile,
}) => {
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
