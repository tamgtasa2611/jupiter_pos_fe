import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Button, Badge, Typography, Space, theme, Flex } from "antd";
import { ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import SearchBar from "./SearchBar";
import CategorySelector from "./CategorySelector";
import ProductGrid from "./ProductGrid";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import CustomerInfo from "./CustomerInfo";
import PaymentModal from "./PaymentModal";
import NumericKeypad from "./NumericKeypad";

const { Content } = Layout;
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
      grocery: ["Gạo", "Đường", "Muối", "Bột ngọt", "Dầu ăn", "Nước mắm", "Tương ớt", "Bột giặt"],
      snacks: ["Bánh quy", "Kẹo", "Snack mực", "Bim bim", "Hạt dưa", "Mít sấy", "Chuối sấy"],
      beverages: [
        "Nước lọc",
        "Nước ngọt",
        "Trà đóng chai",
        "Cà phê hòa tan",
        "Sữa tươi",
        "Nước tăng lực",
      ],
      household: ["Khăn giấy", "Bàn chải", "Kem đánh răng", "Dầu gội", "Xà phòng", "Nước rửa chén"],
    };

    const randomProducts = Array.from({ length: 20 }, (_, index) => {
      const category = productCategories[Math.floor(Math.random() * productCategories.length)];
      const namesForCategory = productNames[category];
      const name = namesForCategory[Math.floor(Math.random() * namesForCategory.length)];
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

    const updatedCart = cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
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
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      <Flex
        gap="large"
        align="center"
        justify="space-between"
        className="w-full"
        style={{
          height: "100%",
        }}
      >
        {/* Products */}
        <div className="h-full w-1/2">
          <Card className="shadow-drop rounded-nice h-full">
            <Flex vertical gap="large" className="w-full h-full">
              <SearchBar onSearch={setSearchQuery} />
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <ProductGrid products={filteredProducts} onProductClick={addToCart} />
            </Flex>
          </Card>
        </div>

        {/* Cart */}
        <div className="h-full w-1/4">
          <Card
            title={
              <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                <Text strong>Giỏ hàng</Text>
                <Badge count={totalItems} showZero />
              </Flex>
            }
            styles={{
              body: { padding: 0, height: "100%" },
            }}
            className="shadow-drop rounded-nice h-full"
          >
            <div className="overflow-auto p-6" style={{ maxHeight: "calc(100% - 60px)" }}>
              {cart.length === 0 ? (
                <Flex vertical justify="center" align="center" className="h-full">
                  <ShoppingCartOutlined style={{ fontSize: 32, divor: token.divorTextSecondary }} />
                  <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                    Giỏ hàng trống
                  </Text>
                </Flex>
              ) : (
                cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onOpenKeypad={openKeypad}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Customer info and order summary */}
        <div className="w-1/4 h-full">
          <Flex vertical style={{ height: "100%", width: "100%" }} gap="large">
            <CustomerInfo customer={customerInfo} onSelectCustomer={setCustomerInfo} />

            <OrderSummary cart={cart} totalAmount={totalAmount} />

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
          </Flex>
        </div>
      </Flex>

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
