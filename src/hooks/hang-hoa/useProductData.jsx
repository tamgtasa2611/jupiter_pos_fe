import { useState, useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";

const useProductData = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

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
    [],
  );

  // Debounced search handler
  const debouncedSetSearchText = useCallback(
    debounce((value) => {
      setSearchText(value);
    }, 300),
    [],
  );

  const fetchProducts = useCallback(() => {
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
            unit: ["Thùng", "Hộp", "Chai", "Lốc", "Gói"][
              Math.floor(Math.random() * 5)
            ],
            isActive,
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
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
        filteredData = filteredData.filter(
          (product) => product.category === selectedCategory,
        );
      }

      if (selectedStatus !== "all") {
        const isActive = selectedStatus === "active";
        filteredData = filteredData.filter(
          (product) => product.isActive === isActive,
        );
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
  }, [searchText, selectedCategory, selectedStatus, categories]);

  // CRUD operations
  const handleAddProduct = useCallback(
    (newProduct) => {
      console.log("Adding new product:", newProduct);
      fetchProducts();
      return true;
    },
    [fetchProducts],
  );

  const handleEditProduct = useCallback(
    (updatedProduct) => {
      console.log("Updating product:", updatedProduct);
      fetchProducts();
      return true;
    },
    [fetchProducts],
  );

  const handleDeleteProduct = useCallback(
    (id) => {
      console.log("Deleting product with ID:", id);
      fetchProducts();
      return true;
    },
    [fetchProducts],
  );

  const handleImportProducts = useCallback(
    (data) => {
      console.log("Importing products:", data);
      fetchProducts();
      return true;
    },
    [fetchProducts],
  );

  // Handle table change
  const handleTableChange = useCallback((paginationInfo) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: paginationInfo.current,
    }));
  }, []);

  // Fetch products on dependencies change
  useEffect(() => {
    fetchProducts();
  }, [
    pagination.pageSize,
    searchText,
    selectedCategory,
    selectedStatus,
    fetchProducts,
  ]);

  return {
    products,
    loading,
    searchText,
    setSearchText: debouncedSetSearchText,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    pagination,
    categories,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleImportProducts,
    handleTableChange,
    updateSearchText: debouncedSetSearchText,
  };
};

export default useProductData;
