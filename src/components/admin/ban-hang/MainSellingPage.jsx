import React, { useState, useEffect } from "react";
import { Button, Typography, theme, Flex, Row, Col, message } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import ProductsSection from "./ProductsSection";
import CartSection from "./CartSection";
import OrderSummary from "./OrderSummary";
import CustomerInfo from "./CustomerInfo";
import PaymentModal from "./PaymentModal";
import NumericKeypad from "./NumericKeypad";
import { getProducts, getProductsVariants } from "@requests/product";
import { createOrder } from "@requests/order";
import { ORDER_STATUS } from "@constants/order";
const { Text } = Typography;

const MainSellingPage = () => {
  const { token } = theme.useToken();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    id: 0,
    name: "Khách lẻ",
    phone: "",
    points: 0,
  });
  const [showNumericKeypad, setShowNumericKeypad] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const fetchProducts = async ({
    search = "",
    page = 0,
    size = 30,
    category,
    productId,
  } = {}) => {
    try {
      setLoading(true);
      const params = {
        search,
        page,
        size,
        category,
        productId,
      };
      const response = await getProductsVariants(params);
      const mappedProducts = [];
      response.content.forEach((item) => {
        const parent = item.product;
        // Bắt đầu với tên sản phẩm cha
        let productName = parent.productName;
        // Nếu variant có attrValues và mảng không rỗng, thêm vào sau tên theo định dạng: "Tên sản phẩm (attr1, attr2)"
        // if (item.attrValues && item.attrValues.length > 0) {
        //   const attrs = item.attrValues.map(
        //     (attr) => `${attr.attrName}: ${attr.attrValue}`,
        //   );
        //   productName = `${productName} (${attrs.join(", ")})`;
        // }
        mappedProducts.push({
          id: item.id,
          name: productName || parent.productName || "",
          description: parent.description || "",
          category:
            parent.categoryList && Array.isArray(parent.categoryList)
              ? parent.categoryList.map((c) => c.categoryName).join(", ")
              : "",
          price: item.price || parent.price || 0,
          costPrice: item.costPrice || parent.costPrice || 0,
          quantity: item.quantity || 0,
          sku: item.sku,
          barcode: item.barcode,
          expiryDate: item.expiryDate,
          image: item.imagePaths?.[0] || "",
          attrValues: item.attrValues,
        });
      });
      // If loading the first page, replace. Otherwise, append.
      if (page === 0) {
        setProducts(mappedProducts);
      } else {
        setProducts((prev) => [...prev, ...mappedProducts]);
      }
    } catch (e) {
      console.log("Lỗi khi tìm kiếm sản phẩm:", e);
    } finally {
      setLoading(false);
      setInitLoading(false);
    }
  };

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  const handleSearch = async ({ search, page, size }) => {
    // Reset products to initial state when searching
    setProducts([]);
    setInitLoading(true);
    setLoading(true);
    // Fetch products with search query
    await fetchProducts({ search, page, size });
    // Reset pagination to the first page
    setSelectedCategory("all");
    setLoading(false);
  };

  // Tính toán tổng đơn hàng
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Tối ưu: tạo cartSummary để truyền vào PaymentModal thay vì toàn bộ cart
  const cartSummary = {
    items: totalItems,
    totalAmount: totalAmount,
  };

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    );
    setCart(updatedCart);
  };

  const openKeypad = (productId) => {
    setSelectedProductId(productId);
    setShowNumericKeypad(true);
  };

  const handleKeypadInput = (value) => {
    updateQuantity(selectedProductId, parseInt(value));
    setShowNumericKeypad(false);
  };

  const handleCheckout = async (data) => {
    // Build your order payload based on the provided DTO structure
    const orderPayload = {
      customerId: customerInfo.id || null, // e.g., 0 for "Khách lẻ"
      receiverName: customerInfo.name || "Khách lẻ",
      receiverPhone: customerInfo.phone || "", // Optional, can be empty for "Khách lẻ"
      receiverAddress: "", // You can gather this from a form
      note: data.note, // Optional
      paymentMethod: data.paymentMethod, // For example
      orderItems: cart.map((item) => ({
        productVariantId: item.id,
        price: item.price,
        soldQuantity: item.quantity,
        soldPrice: item.price,
      })),
      orderStatus: ORDER_STATUS.CHO_XAC_NHAN, // Default status as per DTO
    };

    try {
      const result = await createOrder(orderPayload);
      if (!result || result.error) {
        message.error("Không thể tạo đơn hàng. Vui lòng thử lại!");
      } else {
        message.success("Đơn hàng đã được tạo thành công!");
      }
    } catch (error) {
      message.error("Tạo đơn hàng thất bại. Vui lòng thử lại!");
    }
    setCart([]);
    setIsPaymentModalVisible(false);
  };

  return (
    <>
      <Row
        gutter={[token.marginLG, 0]}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Products - takes 14/24 of the width */}
        <Col span={14} style={{ height: "100%" }}>
          <ProductsSection
            categories={categories}
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onProductClick={addToCart}
            onSearch={handleSearch}
            loading={loading}
            setLoading={setLoading}
            initLoading={initLoading}
          />
        </Col>

        {/* Cart - takes 5/24 of the width */}
        <Col span={5} style={{ height: "100%" }}>
          <CartSection
            cart={cart}
            totalItems={totalItems}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onOpenKeypad={openKeypad}
            theme={{ token }}
          />
        </Col>

        {/* Customer info and order summary - takes 5/24 of the width */}
        <Col span={5} style={{ height: "100%" }}>
          <Flex vertical style={{ height: "100%" }} gap={token.marginMD}>
            {/* CustomerInfo with fixed height */}
            <div style={{ flexShrink: 0 }}>
              <CustomerInfo
                customer={customerInfo}
                onSelectCustomer={setCustomerInfo}
              />
            </div>

            {/* OrderSummary with fixed container height but scrollable content */}
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <OrderSummary cart={cart} totalAmount={totalAmount} />
            </div>

            {/* Payment button with fixed height */}
            <div style={{ flexShrink: 0 }}>
              <Button
                type="primary"
                size="large"
                icon={<DollarOutlined />}
                onClick={() => setIsPaymentModalVisible(true)}
                disabled={cart.length === 0}
                block
                style={{ height: 50 }}
              >
                Thanh toán
              </Button>
            </div>
          </Flex>
        </Col>
      </Row>

      {/* Chỉ render modals khi chúng được hiển thị */}
      {isPaymentModalVisible && (
        <PaymentModal
          visible={isPaymentModalVisible}
          onCancel={() => setIsPaymentModalVisible(false)}
          onCheckout={handleCheckout}
          totalAmount={totalAmount}
          cartSummary={cartSummary} // Chỉ truyền thông tin cần thiết
        />
      )}

      {showNumericKeypad && (
        <NumericKeypad
          visible={showNumericKeypad}
          onCancel={() => setShowNumericKeypad(false)}
          onConfirm={handleKeypadInput}
          title="Nhập số lượng"
        />
      )}
    </>
  );
};

export default MainSellingPage;
