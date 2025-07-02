import React, { useState, useEffect } from "react";
import { Button, theme, Flex, Row, Col, App } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import ProductsSection from "./ProductsSection";
import CartSection from "./CartSection";
import OrderSummary from "./OrderSummary";
import CustomerInfo from "./CustomerInfo";
import PaymentModal from "./PaymentModal";
import NumericKeypad from "./NumericKeypad";
import { getProductsVariants } from "@requests/product";
import { createOrder } from "@requests/order";
import PriceEditModal from "./PriceEditModal";
import { ORDER_STATUS, PAYMENT_METHOD } from "@constants/order";
import { KHACH_LE } from "@constants/customer";
import { DANG_BAN } from "@constants/product";

const MainSellingPage = () => {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(KHACH_LE);
  const [outOfProducts, setOutOfProducts] = useState(false);
  const [showNumericKeypad, setShowNumericKeypad] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedItemForPrice, setSelectedItemForPrice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

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
        status: DANG_BAN,
      };
      const response = await getProductsVariants(params);

      const mappedProducts = [];
      if (response.content.length === 0) {
        setOutOfProducts(true);
      } else {
        setOutOfProducts(false);
      }

      response.content.forEach((item) => {
        const parent = item?.product;
        let productName = parent?.productName;
        if (!productName) {
          return;
        }
        const sortedAttrValues = [...item.attrValues].sort((a, b) =>
          JSON.stringify(a).localeCompare(JSON.stringify(b)),
        );
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
          attrValues: sortedAttrValues,
        });
      });
      // Sử dụng Set để lọc các sản phẩm trùng lặp chỉ dựa trên id
      const seenIds = new Set();
      const uniqueProducts = mappedProducts.filter((item) => {
        if (seenIds.has(item.id)) {
          return false;
        }
        seenIds.add(item.id);
        return true;
      });

      if (page === 0) {
        setProducts(uniqueProducts);
      } else {
        setProducts((prev) => {
          const merged = new Map();
          [...prev, ...uniqueProducts].forEach((product) => {
            merged.set(product.id, product);
          });
          const uniqueCombined = Array.from(merged.values());
          return uniqueCombined;
        });
      }
    } catch (e) {
      console.log("Lỗi khi tìm kiếm sản phẩm:", e);
    } finally {
      setLoading(false);
      setInitLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async ({ search, page, size }) => {
    setInitLoading(true);
    setLoading(true);

    await fetchProducts({ search, page, size });

    setSelectedCategory("all");
    setLoading(false);
  };

  const handleLoadMore = async ({ search, page, size }) => {
    setLoading(true);
    await fetchProducts({ search, page, size });
    setLoading(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.soldPrice || item.price) * item.quantity,
    0,
  );

  const cartSummary = {
    items: totalItems,
    totalAmount: totalAmount,
  };

  const addToCart = (product) => {
    const inStock = product.quantity || 0;
    if (inStock <= 0) {
      message.error(`Sản phẩm ${product.name} đã hết hàng!`);
      return;
    }

    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    if (existingItemIndex !== -1) {
      // Sản phẩm đã có trong giỏ hàng
      const updatedCart = [...cart];
      const newQuantity = updatedCart[existingItemIndex].quantity + 1;

      if (newQuantity > inStock) {
        message.error(
          `Sản phẩm ${product.name} không đủ số lượng! Còn lại: ${inStock}`,
        );
        return;
      } else {
        updatedCart[existingItemIndex].quantity = newQuantity;
        setCart(updatedCart);
      }
    } else {
      // Sản phẩm chưa có trong giỏ hàng
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!newQuantity || newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((item) => item.id === productId);
    if (!product) {
      message.error("Sản phẩm không tồn tại trong danh sách!");
      return;
    }
    const inStock = product.quantity || 0;
    // Kiểm tra số lượng yêu cầu có vượt quá tồn kho không
    if (newQuantity > inStock) {
      message.error(
        `Sản phẩm ${product.name} không đủ số lượng! Còn lại: ${inStock}`,
      );
      return;
    }

    const existingItemIndex = cart.findIndex((item) => item.id === productId);
    if (existingItemIndex === -1) {
      message.error("Sản phẩm không tồn tại trong giỏ hàng!");
      return;
    }

    // Cập nhật số lượng mới
    const updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity = newQuantity;
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

  const validateCart = () => {
    const invalidItems = [];

    for (const cartItem of cart) {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) {
        invalidItems.push(`${cartItem.name} không còn tồn tại`);
        continue;
      }

      const inStock = product.quantity || 0;
      if (cartItem.quantity > inStock) {
        invalidItems.push(
          `${product.name} chỉ còn ${inStock} sản phẩm (yêu cầu: ${cartItem.quantity})`,
        );
      }
    }

    if (invalidItems.length > 0) {
      message.error(`Lỗi: ${invalidItems.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleCheckout = async (data) => {
    if (!validateCart()) {
      return;
    }
    const orderPayload = {
      customerId: customerInfo.id || null,
      receiverName: customerInfo.customerName || "Khách lẻ",
      receiverPhone: customerInfo.phone || "",
      receiverAddress: "",
      note: data.note,
      paid: data.paid || 0,
      orderItems: cart.map((item) => ({
        productVariantId: item.id,
        price: item.price,
        soldQuantity: item.quantity,
        soldPrice: item.soldPrice || item.price,
      })),
      orderStatus: ORDER_STATUS.CHO_XAC_NHAN,
      paymentMethod: data?.paymentMethod || PAYMENT_METHOD.TIEN_MAT,
      orderType: data?.orderType || ORDER_TYPE.MUA_TRUC_TIEP,
    };

    try {
      const res = await createOrder(orderPayload);
      if (!res || res?.response?.data?.message) {
        message.error(
          res?.response?.data?.message ||
            "Không thể tạo đơn hàng. Vui lòng thử lại!",
        );
      } else {
        message.success("Đơn hàng đã được tạo thành công!");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Tạo đơn hàng thất bại. Vui lòng thử lại!",
      );
    }
    setCustomerInfo(KHACH_LE);
    setCart([]);
    setIsPaymentModalVisible(false);
    setCurrentPage(0);
    setSearchQuery("");
    handleSearch({ search: "", page: 0, size: 30 });
  };

  const openPriceModal = (itemId, soldPrice) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    setSelectedItemForPrice({
      id: itemId,
      soldPrice: soldPrice,
      name: item?.name,
    });
    setShowPriceModal(true);
  };

  const handlePriceUpdate = (newPrice) => {
    if (selectedItemForPrice) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === selectedItemForPrice.id
            ? { ...item, soldPrice: newPrice }
            : item,
        ),
      );
    }
  };

  return (
    <>
      <Row gutter={[16, 0]} style={{ width: "100%" }} className="h-fit-screen">
        {/* Products - takes 14/24 of the width */}
        <Col span={14} style={{ height: "100%" }}>
          <ProductsSection
            categories={categories}
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onProductClick={addToCart}
            onSearch={handleSearch}
            onLoadMore={handleLoadMore}
            loading={loading}
            setLoading={setLoading}
            initLoading={initLoading}
            outOfProducts={outOfProducts}
            setOutOfProducts={setOutOfProducts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
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
            onOpenPriceModal={openPriceModal}
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
                onClick={() => {
                  if (validateCart()) {
                    setIsPaymentModalVisible(true);
                  }
                }}
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
          cartSummary={cartSummary}
        />
      )}

      {showNumericKeypad && (
        <NumericKeypad
          visible={showNumericKeypad}
          onCancel={() => setShowNumericKeypad(false)}
          onConfirm={handleKeypadInput}
          initialValue={
            cart.find((item) => item.id === selectedProductId)?.quantity || 1
          }
          title="Nhập số lượng"
        />
      )}

      {showPriceModal && (
        <PriceEditModal
          visible={showPriceModal}
          onCancel={() => setShowPriceModal(false)}
          onConfirm={handlePriceUpdate}
          currentPrice={
            selectedItemForPrice?.soldPrice || selectedItemForPrice?.price
          }
          productName={selectedItemForPrice?.name}
        />
      )}
    </>
  );
};

export default MainSellingPage;
