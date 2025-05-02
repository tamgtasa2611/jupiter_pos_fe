import React, { useState, useEffect } from "react";
import { Button, Typography, theme, Flex, Row, Col } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import ProductsSection from "./ProductsSection";
import CartSection from "./CartSection";
import OrderSummary from "./OrderSummary";
import CustomerInfo from "./CustomerInfo";
import PaymentModal from "./PaymentModal";
import NumericKeypad from "./NumericKeypad";

const { Text } = Typography;

const MainSellingPage = () => {
  const { token } = theme.useToken();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [showNumericKeypad, setShowNumericKeypad] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Mock data - replace with API calls
  useEffect(() => {
    // Generate 20 random products
    const productCategories = ["grocery", "snacks", "beverages", "household"];
    const productNames = {
      grocery: [
        "Gạo",
        "Đường",
        "Muối",
        "Bột ngọt",
        "Dầu ăn",
        "Nước mắm",
        "Tương ớt",
        "Bột giặt",
      ],
      snacks: [
        "Bánh quy",
        "Kẹo",
        "Snack mực",
        "Bim bim",
        "Hạt dưa",
        "Mít sấy",
        "Chuối sấy",
      ],
      beverages: [
        "Nước lọc",
        "Nước ngọt",
        "Trà đóng chai",
        "Cà phê hòa tan",
        "Sữa tươi",
        "Nước tăng lực",
      ],
      household: [
        "Khăn giấy",
        "Bàn chải",
        "Kem đánh răng",
        "Dầu gội",
        "Xà phòng",
        "Nước rửa chén",
      ],
    };

    const randomProducts = Array.from({ length: 20 }, (_, index) => {
      const category =
        productCategories[Math.floor(Math.random() * productCategories.length)];
      const namesForCategory = productNames[category];
      const name =
        namesForCategory[Math.floor(Math.random() * namesForCategory.length)];
      const price = Math.floor(Math.random() * 5 + 1) * 10000 + 5000; // Random price between 15000 and 55000

      return {
        id: index + 1,
        name: `${name}`,
        price: price,
        category: category,
        image: "../../../haohao.png",
      };
    });

    setProducts(randomProducts);

    // Simulate fetching categories
    setCategories([
      { id: "all", name: "Tất cả" },
      { id: "coffee", name: "Cà phê" },
      { id: "tea", name: "Trà" },
      { id: "food", name: "Đồ ăn" },
      { id: "drinks", name: "Nước uống" },
    ]);
  }, []);

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

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "all" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
                minHeight: 0, // Critical for Firefox to respect flex constraints
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

      <PaymentModal
        visible={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        onComplete={handlePaymentComplete}
        totalAmount={totalAmount}
        cart={cart}
      />

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
