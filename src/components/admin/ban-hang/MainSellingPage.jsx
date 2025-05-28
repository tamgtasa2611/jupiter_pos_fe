import React, { useState, useEffect } from "react";
import { Button, Typography, theme, Flex, Row, Col } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import ProductsSection from "./ProductsSection";
import CartSection from "./CartSection";
import OrderSummary from "./OrderSummary";
import CustomerInfo from "./CustomerInfo";
import PaymentModal from "./PaymentModal";
import NumericKeypad from "./NumericKeypad";
import { getProducts, getProductsVariants } from "@requests/product";

const { Text } = Typography;

const MainSellingPage = () => {
  const { token } = theme.useToken();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [showNumericKeypad, setShowNumericKeypad] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const fetchProducts = async ({
    sort = "lastModifiedDate,desc",
    search = "",
    page = 0,
    size = 20,
    category,
    productId,
  } = {}) => {
    try {
      setLoading(true);
      const params = {
        sort,
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
        if (item.attrValues && item.attrValues.length > 0) {
          const attrs = item.attrValues.map(
            (attr) => `${attr.attrName}: ${attr.attrValue}`,
          );
          productName = `${productName} (${attrs.join(", ")})`;
        }
        mappedProducts.push({
          id: item.id,
          name: productName,
          description: parent.description,
          category:
            parent.category && Array.isArray(parent.category)
              ? parent.category.map((c) => c.categoryName).join(", ")
              : "",
          price: item.price,
          costPrice: item.costPrice,
          quantity: item.quantity,
          sku: item.sku,
          barcode: item.barcode,
          expiryDate: item.expiryDate,
          image: parent.image || "../../../haohao.png",
          attrValues: item.attrValues,
        });
      });
      // If loading the first page, replace. Otherwise, append.
      if (page === 0) {
        setProducts(mappedProducts);
      } else {
        setProducts((prev) => [...prev, ...mappedProducts]);
      }
      console.log("Products fetched:", mappedProducts);
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

  const handleCheckout = () => {
    setIsPaymentModalVisible(true);
  };

  const handlePaymentComplete = (paymentDetails) => {
    // Process payment and order creation
    console.log("Payment completed:", paymentDetails);
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
            onSearch={fetchProducts}
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
                onClick={handleCheckout}
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
          onComplete={handlePaymentComplete}
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
