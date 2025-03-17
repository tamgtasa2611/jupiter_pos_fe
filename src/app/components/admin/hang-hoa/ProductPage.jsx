"use client";

import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { Card, Button, Select, Dropdown, Flex, Menu, Drawer, Input, Divider } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ExportOutlined,
  ImportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  MenuOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import ProductTable from "./ProductTable";
import ProductList from "./ProductList";
import ProductFilters from "./ProductFilters";
import MobileMenu from "./MobileMenu";
import { Typography } from "antd";
import { debounce } from "lodash";

const { Title } = Typography;
const { Option } = Select;

// Lazy load modal components
const AddProductModal = dynamic(() => import("./AddProductModal"), {
  loading: () => <p>Loading...</p>,
});
const EditProductModal = dynamic(() => import("./EditProductModal"), {
  loading: () => <p>Loading...</p>,
});
const ViewProductModal = dynamic(() => import("./ViewProductModal"), {
  loading: () => <p>Loading...</p>,
});
const DeleteProductModal = dynamic(() => import("./DeleteProductModal"), {
  loading: () => <p>Loading...</p>,
});
const ImportProductsModal = dynamic(() => import("./ImportProductsModal"), {
  loading: () => <p>Loading...</p>,
});

// Memoize ProductTable, ProductList, and ProductFilters
const MemoizedProductTable = React.memo(ProductTable);
const MemoizedProductList = React.memo(ProductList);
const MemoizedProductFilters = React.memo(ProductFilters);

const ProductPage = () => {
  // State management
  const [isMobile, setIsMobile] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 200,
    position: ["bottomCenter"],
    showSizeChanger: true,
  });

  const categories = useMemo(
    () => [
      { value: "beverages", label: "Đồ uống" },
      { value: "food", label: "Thực phẩm" },
      { value: "snacks", label: "Bánh kẹo" },
      { value: "household", label: "Đồ gia dụng" },
      { value: "personal_care", label: "Chăm sóc cá nhân" },
    ],
    []
  );

  // Check for mobile screen
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Debounced search handler
  const debouncedSetSearchText = useCallback(
    debounce((value) => {
      setSearchText(value);
    }, 300),
    []
  );

  // Mock data fetch
  useEffect(() => {
    fetchProducts();
  }, [pagination.current, pagination.pageSize, searchText, selectedCategory, selectedStatus]);

  const fetchProducts = () => {
    setLoading(true);

    // Mock API call
    setTimeout(() => {
      // Generate mock data
      const mockData = Array(35)
        .fill()
        .map((_, index) => {
          const id = index + 1;
          const categoryIndex = Math.floor(Math.random() * categories.length);
          const category = categories[categoryIndex];
          const price = Math.floor(Math.random() * 500000) + 10000;
          const costPrice = Math.floor(price * 0.7);
          const stock = Math.floor(Math.random() * 1000);
          const isActive = Math.random() > 0.2;

          return {
            id,
            barcode: `SP${String(id).padStart(6, "0")}`,
            name: `Sản phẩm ${id}`,
            category: category.value,
            categoryName: category.label,
            price,
            costPrice,
            stock,
            unit: ["Thùng", "Hộp", "Chai", "Lốc", "Gói"][Math.floor(Math.random() * 5)],
            isActive,
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
            image: "../../../haohao.png",
          };
        });

      // Filter data based on search and filters
      let filteredData = [...mockData];

      if (searchText) {
        const searchTerm = searchText.toLowerCase();
        filteredData = filteredData.filter((product) => {
          const name = product.name.toLowerCase();
          const barcode = product.barcode.toLowerCase();
          return name.includes(searchTerm) || barcode.includes(searchTerm);
        });
      }

      if (selectedCategory !== "all") {
        filteredData = filteredData.filter((product) => product.category === selectedCategory);
      }

      if (selectedStatus !== "all") {
        const isActive = selectedStatus === "active";
        filteredData = filteredData.filter((product) => product.isActive === isActive);
      }

      // Total and pagination
      const totalItems = filteredData.length;
      const start = (pagination.current - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      const paginatedData = filteredData.slice(start, end);

      setProducts(paginatedData);
      setPagination({
        ...pagination,
        total: totalItems,
      });
      setLoading(false);
    }, 500);
  };

  // CRUD operations
  const handleAddProduct = useCallback(
    (newProduct) => {
      // In a real app, you would make an API call here
      console.log("Adding new product:", newProduct);
      setAddModalVisible(false);
      fetchProducts(); // Refresh data
    },
    [fetchProducts]
  );

  const handleEditProduct = useCallback(
    (updatedProduct) => {
      // In a real app, you would make an API call here
      console.log("Updating product:", updatedProduct);
      setEditModalVisible(false);
      fetchProducts(); // Refresh data
    },
    [fetchProducts]
  );

  const handleDeleteProduct = useCallback(
    (id) => {
      // In a real app, you would make an API call here
      console.log("Deleting product with ID:", id);
      setDeleteModalVisible(false);
      fetchProducts(); // Refresh data
    },
    [fetchProducts]
  );

  const handleImportProducts = useCallback(
    (data) => {
      // In a real app, you would make an API call here
      console.log("Importing products:", data);
      setImportModalVisible(false);
      fetchProducts(); // Refresh data
    },
    [fetchProducts]
  );

  // Handle table change
  const handleTableChange = useCallback((pagination) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: pagination.current,
    }));
  }, []);

  const handleScanCode = async () => {
    // Check if running in Capacitor environment (mobile app)
    const isNativeApp = typeof window !== "undefined" && window.Capacitor;

    // If running in Capacitor environment and the MLKit BarcodeScanning plugin is available
    if (isNativeApp && window.Capacitor.Plugins.BarcodeScanning) {
      try {
        const { BarcodeScanning } = window.Capacitor.Plugins;

        // Check permissions
        const { camera } = await BarcodeScanning.checkPermissions();

        if (camera !== "granted") {
          const { camera } = await BarcodeScanning.requestPermissions();
          if (camera !== "granted") {
            alert("Vui lòng cấp quyền truy cập camera để quét mã vạch.");
            return;
          }
        }

        // Start scanning
        const { barcodes } = await BarcodeScanning.scan({
          formats: [
            "QR_CODE",
            "EAN_13",
            "EAN_8",
            "UPC_A",
            "UPC_E",
            "CODE_39",
            "CODE_93",
            "CODE_128",
          ],
        });

        if (barcodes.length > 0) {
          console.log("Barcode data:", barcodes[0].rawValue);
          // Search for the product using the scanned barcode
          debouncedSetSearchText(barcodes[0].rawValue);
        }
      } catch (error) {
        console.error("Barcode scanning error:", error);
        alert("Lỗi khi quét mã: " + error.message);
      }
    }
    // Fallback to browser-based scanner
    else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        // Create and show a modal with video element for scanning
        const videoModal = document.createElement("div");
        videoModal.style = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
          z-index: 9999;
        `;

        const video = document.createElement("video");
        video.style = `
          width: 100%;
          height: calc(100% - 60px);
          object-fit: cover;
        `;
        video.srcObject = stream;
        video.autoplay = true;

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Hủy";
        closeBtn.style = `
          padding: 12px;
          background: #f44336;
          color: white;
          border: none;
          height: 60px;
          font-size: 16px;
        `;

        closeBtn.onclick = () => {
          stream.getTracks().forEach((track) => track.stop());
          document.body.removeChild(videoModal);
        };

        videoModal.appendChild(video);
        videoModal.appendChild(closeBtn);
        document.body.appendChild(videoModal);

        // Load the browser-based barcode scanner (using ZXing library)
        try {
          // Use dynamic import to load ZXing only when needed
          const { BrowserMultiFormatReader } = await import("@zxing/library");

          const codeReader = new BrowserMultiFormatReader();
          codeReader
            .decodeFromVideoElement(video)
            .then((result) => {
              // Found a barcode
              if (result && result.text) {
                debouncedSetSearchText(result.text);
                stream.getTracks().forEach((track) => track.stop());
                document.body.removeChild(videoModal);
              }
            })
            .catch((err) => {
              console.warn("Barcode detection error:", err);
              // Continue scanning
            });
        } catch (e) {
          console.error("Error loading barcode scanning library:", e);
          alert("Không thể tải thư viện quét mã vạch. Vui lòng thử lại sau.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Truy cập camera thất bại. Vui lòng cấp quyền truy cập camera.");
      }
    } else {
      alert("Thiết bị của bạn không hỗ trợ quét mã vạch.");
    }
  };

  // Filter drawer content for mobile
  const filterDrawerContent = (
    <Flex vertical gap={12}>
      <Select
        placeholder="Danh mục"
        style={{ width: "100%" }}
        value={selectedCategory}
        onChange={setSelectedCategory}
        allowClear
      >
        <Option value="all">Tất cả danh mục</Option>
        {categories.map((category) => (
          <Option key={category.value} value={category.value}>
            {category.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Trạng thái"
        style={{ width: "100%" }}
        value={selectedStatus}
        onChange={setSelectedStatus}
        allowClear
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value="active">Đang bán</Option>
        <Option value="inactive">Ngừng bán</Option>
      </Select>

      <Button type="primary" block onClick={() => setFilterDrawerOpen(false)}>
        Áp dụng
      </Button>
    </Flex>
  );

  const updateSearchText = (value) => {
    debouncedSetSearchText(value);
  };

  return (
    <div className="min-h-screen">
      <Card className="shadow-drop rounded-nice transition-shadow">
        <Flex justify="space-between" align="center" wrap="wrap" style={{ marginBottom: 24 }}>
          <div className="">
            <Title level={4} style={{ margin: 0 }}>
              {isMobile && (
                <Button
                  size="large"
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMenuDrawerOpen(true)}
                  style={{ marginRight: 8 }}
                />
              )}
              Hàng hóa
            </Title>
          </div>

          {/* Action bar - Desktop */}
          {!isMobile && (
            <Flex justify="space-between" align="center" wrap="wrap" gap={16} className="mb-6">
              {/* Search and filters */}
              <MemoizedProductFilters
                searchText={searchText}
                setSearchText={updateSearchText}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                categories={categories}
                isMobile={isMobile}
              />

              {/* Action buttons */}
              <Flex gap={8} wrap="wrap">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddModalVisible(true)}
                >
                  Thêm sản phẩm
                </Button>

                <Button icon={<ImportOutlined />} onClick={() => setImportModalVisible(true)}>
                  Nhập từ Excel
                </Button>

                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "1",
                        icon: <FileExcelOutlined />,
                        label: "Xuất Excel",
                      },
                      {
                        key: "2",
                        icon: <FilePdfOutlined />,
                        label: "Xuất PDF",
                      },
                      {
                        key: "3",
                        icon: <PrinterOutlined />,
                        label: "In danh sách",
                      },
                    ],
                  }}
                >
                  <Button icon={<ExportOutlined />}>
                    Xuất
                    <svg className="inline-block w-2 h-2 ml-1 -mt-1" viewBox="0 0 6 3">
                      <polygon points="0,0 6,0 3,3" fill="currentColor" />
                    </svg>
                  </Button>
                </Dropdown>
              </Flex>
            </Flex>
          )}

          {/* Mobile Filter Button */}
          {isMobile && (
            <Flex gap="middle">
              <Button size="large" icon={<SortAscendingOutlined />} onClick={() => {}}></Button>
              <Button
                size="large"
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerOpen(true)}
              ></Button>
            </Flex>
          )}
        </Flex>

        {/* Product Table for Desktop */}
        {!isMobile && (
          <MemoizedProductTable
            products={products}
            loading={loading}
            pagination={pagination}
            handleTableChange={handleTableChange}
            setSelectedProduct={setSelectedProduct}
            setViewModalVisible={setViewModalVisible}
            setEditModalVisible={setEditModalVisible}
            setDeleteModalVisible={setDeleteModalVisible}
          />
        )}

        {isMobile && (
          <>
            <Flex gap="middle">
              <Input
                placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                size="large"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => updateSearchText(e.target.value)}
                allowClear
              />
              <Button size="large" icon={<ScanOutlined />} onClick={handleScanCode}></Button>
            </Flex>
            <Divider style={{ marginBottom: 0 }} />
          </>
        )}

        {/* Product List for Mobile */}
        {isMobile && (
          <MemoizedProductList
            products={products}
            loading={loading}
            pagination={pagination}
            setSelectedProduct={setSelectedProduct}
            setViewModalVisible={setViewModalVisible}
            setEditModalVisible={setEditModalVisible}
            setDeleteModalVisible={setDeleteModalVisible}
          />
        )}
      </Card>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        open={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        width={280}
      >
        <MobileMenu
          setAddModalVisible={setAddModalVisible}
          setImportModalVisible={setImportModalVisible}
        />
      </Drawer>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ lọc"
        placement="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        width={300}
      >
        {filterDrawerContent}
      </Drawer>

      {/* Modals */}
      <AddProductModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onAdd={handleAddProduct}
        categories={categories}
        isMobile={isMobile}
      />

      {selectedProduct && (
        <>
          <EditProductModal
            visible={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onEdit={handleEditProduct}
            product={selectedProduct}
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

      <Button
        type="primary"
        shape="circle"
        onClick={() => setAddModalVisible(true)}
        icon={<PlusOutlined />}
        className="right-4 shadow-sm"
        style={{
          zIndex: 2,
          position: "fixed",
          bottom: "80px",
          width: "48px",
          height: "48px",
          display: isMobile ? "block" : "none",
        }}
      ></Button>
    </div>
  );
};

export default ProductPage;
