import React, { useEffect, useState } from "react";
import { App } from "antd";
import dynamic from "next/dynamic";
import { createCategory } from "@requests/category";
import { createUnit } from "@requests/unit";
import { createAttribute } from "@requests/attribute";
import AddCategoryModal from "./common/AddCategoryModal";
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

const ManageCategoryModal = dynamic(
  () => import("./manage/ManageCategoryModal"),
  {
    loading: () => <p>Đang tải dữ liệu...</p>,
  },
);

const ManageAttributeModal = dynamic(
  () => import("./manage/ManageAttributeModal"),
  {
    loading: () => <p>Đang tải dữ liệu...</p>,
  },
);

const ManageUnitModal = dynamic(() => import("./manage/ManageUnitModal"), {
  loading: () => <p>Đang tải dữ liệu...</p>,
});

const ModalManager = ({
  addProductModalVisible,
  editProductModalVisible,
  viewProductModalVisible,
  addVariantModalVisible,
  importModalVisible,
  setAddProductModalVisible,
  setEditProductModalVisible,
  setViewProductModalVisible,
  setAddVariantModalVisible,
  setImportModalVisible,
  selectedProductId,
  selectedVariantId,
  handleAddProduct,
  handleEditProduct,
  handleAddVariant,
  handleEditProductVariant,
  handleUpdateProductStatus,
  handleImportProducts,
  categories,
  reloadCategories,
  categorySearchText,
  setCategorySearchText,
  units,
  reloadUnits,
  unitSearchText,
  setUnitSearchText,
  attributes,
  reloadAttributes,
  attributeSearchText,
  setAttributeSearchText,
  isMobile,
  viewVariantModalVisible,
  setViewVariantModalVisible,
  editVariantModalVisible,
  setEditVariantModalVisible,
  isOpenManageCategories,
  setIsOpenManageCategories,
  isOpenManageAttributes,
  setIsOpenManageAttributes,
  isOpenManageUnits,
  setIsOpenManageUnits,
  pagination,
  searchText,
  selectedCategory,
  selectedStatus,
  fetchProducts,
}) => {
  const { message } = App.useApp();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  const handleAddCategory = () => {
    setCategoryModalVisible(true);
  };

  const handleCategorySubmit = async (values) => {
    try {
      const res = await createCategory({ categoryName: values.categoryName });
      if (!res || res?.response?.data?.message) {
        message.error(
          res?.response?.data?.message || "Thêm danh mục thất bại!",
        );
        return;
      } else {
        message.success("Danh mục mới được thêm thành công!");
        reloadCategories();
        setCategoryModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add category", error?.response?.data?.message);
      message.error(
        error?.response?.data?.message || "Thêm danh mục thất bại!",
      );
    }
  };

  const handleAddAttribute = () => {
    setAttributeModalVisible(true);
  };

  const handleAttributeSubmit = async (values) => {
    try {
      const res = await createAttribute({
        attributeName: values.attributeName,
      });
      if (!res || res?.response?.data?.message) {
        message.error(
          res?.response?.data?.message || "Thêm thuộc tính thất bại!",
        );
        return;
      } else {
        message.success("Thuộc tính mới được thêm thành công!");
        reloadAttributes();
        setAttributeModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add attribute", error?.response?.data?.message);
      message.error(
        error?.response?.data?.message || "Thêm thuộc tính thất bại!",
      );
    }
  };

  const handleAddUnit = () => {
    setUnitModalVisible(true);
  };

  const handleUnitSubmit = async (values) => {
    try {
      const res = await createUnit({ name: values.unitName });
      if (!res || res?.response?.data?.message) {
        message.error(res?.response?.data?.message || "Thêm đơn vị thất bại!");
        return;
      } else {
        message.success("Đơn vị mới được thêm thành công!");
        reloadUnits();
        setUnitModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to add unit", error?.response?.data?.message);
      message.error(error?.response?.data?.message || "Thêm đơn vị thất bại!");
    }
  };

  const props = {
    handleAddCategory: handleAddCategory,
    handleAddAttribute: handleAddAttribute,
    handleAddUnit: handleAddUnit,
    handleCategorySubmit: handleCategorySubmit,
    handleAttributeSubmit: handleAttributeSubmit,
    handleUnitSubmit: handleUnitSubmit,
    categorySearchText: categorySearchText,
    setCategorySearchText: setCategorySearchText,
    unitSearchText: unitSearchText,
    setUnitSearchText: setUnitSearchText,
    attributeSearchText: attributeSearchText,
    setAttributeSearchText: setAttributeSearchText,
    reloadCategories: reloadCategories,
    reloadUnits: reloadUnits,
    reloadAttributes: reloadAttributes,
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
            setUnitSearchText={setUnitSearchText}
            setAttributeSearchText={setAttributeSearchText}
            unitSearchText={unitSearchText}
            attributeSearchText={attributeSearchText}
            reloadUnits={reloadUnits}
            reloadAttributes={reloadAttributes}
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
            setUnitSearchText={setUnitSearchText}
            setAttributeSearchText={setAttributeSearchText}
            unitSearchText={unitSearchText}
            attributeSearchText={attributeSearchText}
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

      {isOpenManageCategories && (
        <ManageCategoryModal
          open={isOpenManageCategories}
          setOpen={setIsOpenManageCategories}
          reloadCategories={reloadCategories}
          onCancel={() => {
            setIsOpenManageCategories(false);
            fetchProducts({
              page: pagination.current - 1,
              size: pagination.pageSize,
              search: searchText,
              category: selectedCategory,
              status: selectedStatus,
            });
          }}
        />
      )}

      {isOpenManageAttributes && (
        <ManageAttributeModal
          open={isOpenManageAttributes}
          setOpen={setIsOpenManageAttributes}
          reloadAttributes={reloadAttributes}
          onCancel={() => {
            setIsOpenManageAttributes(false);
            fetchProducts({
              page: pagination.current - 1,
              size: pagination.pageSize,
              search: searchText,
              category: selectedCategory,
              status: selectedStatus,
            });
          }}
        />
      )}

      {isOpenManageUnits && (
        <ManageUnitModal
          open={isOpenManageUnits}
          setOpen={setIsOpenManageUnits}
          reloadUnits={reloadUnits}
          onCancel={() => {
            setIsOpenManageUnits(false);
            fetchProducts({
              page: pagination.current - 1,
              size: pagination.pageSize,
              search: searchText,
              category: selectedCategory,
              status: selectedStatus,
            });
          }}
        />
      )}
    </>
  );
};

export default ModalManager;
