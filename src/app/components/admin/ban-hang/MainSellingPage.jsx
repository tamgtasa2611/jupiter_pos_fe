import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Button, Badge, Typography, Space, theme } from "antd";
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
    // Simulate fetching products
    setProducts([
      {
        id: 1,
        name: "Cà phê đen",
        price: 25000,
        category: "coffee",
        image: "https://via.placeholder.com/80",
      },
      {
        id: 2,
        name: "Cà phê sữa",
        price: 30000,
        category: "coffee",
        image: "https://via.placeholder.com/80",
      },
      {
        id: 3,
        name: "Trà đào",
        price: 35000,
        category: "tea",
        image: "https://via.placeholder.com/80",
      },
      {
        id: 4,
        name: "Trà sữa",
        price: 40000,
        category: "tea",
        image: "https://via.placeholder.com/80",
      },
      {
        id: 5,
        name: "Bánh mì",
        price: 20000,
        category: "food",
        image: "https://via.placeholder.com/80",
      },
      {
        id: 6,
        name: "Bánh ngọt",
        price: 15000,
        category: "food",
        image: "https://via.placeholder.com/80",
      },
      {
        id: 7,
        name: "Nước suối",
        price: 10000,
        category: "drinks",
        image: "https://via.placeholder.com/80",
      },
      {
        id: 8,
        name: "Nước ngọt",
        price: 15000,
        category: "drinks",
        image: "https://via.placeholder.com/80",
      },
    ]);

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
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card bodyStyle={{ padding: "12px" }} className="shadow-drop rounded-nice">
            <Space direction="vertical" style={{ width: "100%" }}>
              <SearchBar onSearch={setSearchQuery} />
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <ProductGrid products={filteredProducts} onProductClick={addToCart} />
            </Space>
          </Card>
        </Col>

        <Col span={8}>
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <CustomerInfo customer={customerInfo} onSelectCustomer={setCustomerInfo} />

            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong>Giỏ hàng</Text>
                  <Badge count={totalItems} showZero />
                </div>
              }
              bodyStyle={{
                padding: "12px",
                maxHeight: "350px",
                overflow: "auto",
              }}
              className="shadow-drop rounded-nice"
            >
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <ShoppingCartOutlined style={{ fontSize: 32, color: token.colorTextSecondary }} />
                  <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                    Giỏ hàng trống
                  </Text>
                </div>
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
            </Card>

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
          </Space>
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
