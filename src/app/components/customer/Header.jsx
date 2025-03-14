"use client";

import { useEffect, useState } from "react";
import { Menu, Button, Drawer, Space, Badge, Dropdown, Input, Avatar } from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  DownOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Search } = Input;

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock state for login status

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  // Main navigation items
  const mainMenuItems = [
    { key: "home", label: <Link href="/">Trang chủ</Link> },
    {
      key: "men",
      label: (
        <span>
          Nam <DownOutlined style={{ fontSize: "12px" }} />
        </span>
      ),
      children: [
        {
          key: "men-clothing",
          label: "Quần áo",
          children: [
            {
              key: "men-shirts",
              label: <Link href="/products?category=men-shirts">Áo sơ mi</Link>,
            },
            {
              key: "men-tshirts",
              label: <Link href="/products?category=men-tshirts">Áo phông</Link>,
            },
            { key: "men-pants", label: <Link href="/products?category=men-pants">Quần</Link> },
            {
              key: "men-jeans",
              label: <Link href="/products?category=men-jeans">Quần jeans</Link>,
            },
            {
              key: "men-shorts",
              label: <Link href="/products?category=men-shorts">Quần short</Link>,
            },
            {
              key: "men-jackets",
              label: <Link href="/products?category=men-jackets">Áo khoác</Link>,
            },
          ],
        },
        {
          key: "men-accessories",
          label: "Phụ kiện",
          children: [
            { key: "men-bags", label: <Link href="/products?category=men-bags">Túi xách</Link> },
            {
              key: "men-watches",
              label: <Link href="/products?category=men-watches">Đồng hồ</Link>,
            },
            { key: "men-belts", label: <Link href="/products?category=men-belts">Thắt lưng</Link> },
          ],
        },
      ],
    },
    {
      key: "women",
      label: (
        <span>
          Nữ <DownOutlined style={{ fontSize: "12px" }} />
        </span>
      ),
      children: [
        {
          key: "women-clothing",
          label: "Quần áo",
          children: [
            {
              key: "women-blouses",
              label: <Link href="/products?category=women-blouses">Áo sơ mi</Link>,
            },
            {
              key: "women-tshirts",
              label: <Link href="/products?category=women-tshirts">Áo phông</Link>,
            },
            { key: "women-pants", label: <Link href="/products?category=women-pants">Quần</Link> },
            {
              key: "women-jeans",
              label: <Link href="/products?category=women-jeans">Quần jeans</Link>,
            },
            {
              key: "women-skirts",
              label: <Link href="/products?category=women-skirts">Chân váy</Link>,
            },
            {
              key: "women-dresses",
              label: <Link href="/products?category=women-dresses">Váy đầm</Link>,
            },
            {
              key: "women-jackets",
              label: <Link href="/products?category=women-jackets">Áo khoác</Link>,
            },
          ],
        },
        {
          key: "women-accessories",
          label: "Phụ kiện",
          children: [
            {
              key: "women-bags",
              label: <Link href="/products?category=women-bags">Túi xách</Link>,
            },
            {
              key: "women-jewelry",
              label: <Link href="/products?category=women-jewelry">Trang sức</Link>,
            },
            {
              key: "women-scarves",
              label: <Link href="/products?category=women-scarves">Khăn quàng</Link>,
            },
          ],
        },
      ],
    },
    {
      key: "kids",
      label: (
        <span>
          Trẻ em <DownOutlined style={{ fontSize: "12px" }} />
        </span>
      ),
      children: [
        { key: "boys", label: <Link href="/products?category=boys">Bé trai</Link> },
        { key: "girls", label: <Link href="/products?category=girls">Bé gái</Link> },
      ],
    },
    {
      key: "collections",
      label: (
        <span>
          Bộ sưu tập <DownOutlined style={{ fontSize: "12px" }} />
        </span>
      ),
      children: [
        { key: "new-arrivals", label: <Link href="/collections/new-arrivals">Hàng mới về</Link> },
        { key: "best-sellers", label: <Link href="/collections/best-sellers">Bán chạy</Link> },
        { key: "summer-collection", label: <Link href="/collections/summer">BST Hè 2025</Link> },
      ],
    },
    {
      key: "sale",
      label: (
        <Link href="/sale" className="text-red-500 font-bold">
          SALE
        </Link>
      ),
    },
  ];

  // Mobile menu items (simplified)
  const mobileMenuItems = [
    { key: "home", label: <Link href="/">Trang chủ</Link> },
    { key: "men", label: <Link href="/products?gender=men">Nam</Link> },
    { key: "women", label: <Link href="/products?gender=women">Nữ</Link> },
    { key: "kids", label: <Link href="/products?category=kids">Trẻ em</Link> },
    { key: "collections", label: <Link href="/collections">Bộ sưu tập</Link> },
    {
      key: "sale",
      label: (
        <Link href="/sale" className="text-red-500 font-bold">
          SALE
        </Link>
      ),
    },
    { key: "about", label: <Link href="/gioi-thieu">Về chúng tôi</Link> },
    { key: "contact", label: <Link href="/contact">Liên hệ</Link> },
  ];

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "1",
      label: (
        <Link href="/profile">
          <Space>
            <UserOutlined />
            Tài khoản của tôi
          </Space>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link href="/orders">
          <Space>
            <ShoppingOutlined />
            Đơn hàng của tôi
          </Space>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link href="/yeu-thich">
          <Space>
            <HeartOutlined />
            Danh sách yêu thích
          </Space>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link href="/settings">
          <Space>
            <SettingOutlined />
            Cài đặt
          </Space>
        </Link>
      ),
    },
    {
      key: "5",
      type: "divider",
    },
    {
      key: "6",
      label: (
        <a onClick={() => setIsLoggedIn(false)}>
          <Space>
            <LogoutOutlined />
            Đăng xuất
          </Space>
        </a>
      ),
    },
  ];

  const cartCount = 3; // Mock cart count
  const notificationCount = 5; // Mock notification count
  const wishlistCount = 2; // Mock wishlist count

  return (
    <>
      {/* Top bar with announcements, language, currency - all white */}
      <div className="w-full bg-white text-gray-600 text-xs py-2 px-4 hidden md:block border-b border-gray-100">
        <div className="container mx-auto flex justify-between">
          <div>
            <span>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
          </div>
          <div className="flex gap-4">
            <Link href="/track-order" className="text-gray-600 hover:text-blue-500">
              Theo dõi đơn hàng
            </Link>
            <Link href="/store-locator" className="text-gray-600 hover:text-blue-500">
              Hệ thống cửa hàng
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-500">
              Liên hệ
            </Link>
            {/* <span>|</span>
            <Link href="/language" className="text-gray-600 hover:text-blue-500">
              Tiếng Việt
            </Link>
            <Link href="/currency" className="text-gray-600 hover:text-blue-500">
              VND
            </Link> */}
          </div>
        </div>
      </div>

      {/* Custom navbar - replacing AntHeader */}
      <header 
        className={`w-full z-50 bg-white shadow-2xs border-b border-gray-100`}
        style={{ position: "sticky", top: 0, transition: "all 0.3s" }}
      >
        <div className="container mx-auto px-4 py-4">
          {/* First row: Logo, Search, Account, Cart */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                type="text"
                icon={<MenuOutlined />}
                className="md:hidden text-gray-600 flex items-center justify-center"
                onClick={showDrawer}
                size="large"
                style={{ border: "none", padding: "0 8px", height: "40px" }}
              />

              {/* Logo */}
              <div className="logo">
                <Link href="/" className="flex items-center">
                  <h1 className="text-2xl font-bold m-0 text-gray-800">Jupiter</h1>
                </Link>
              </div>
            </div>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:block flex-grow mx-10 max-w-xl">
              <div className="relative">
                <Search
                  placeholder="Tìm kiếm sản phẩm..."
                  enterButton={<SearchOutlined />}
                  size="large"
                  className="w-full"
                  style={{ boxShadow: "none" }}
                />
              </div>
            </div>

            {/* Right section: User actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search button on mobile */}
              <Button
                type="text"
                icon={<SearchOutlined />}
                size="large"
                className="md:hidden text-gray-600 flex items-center justify-center"
                style={{ border: "none", padding: "0 8px", height: "40px" }}
              />

              {/* Wishlist */}
              <div className="relative">
                <Badge count={wishlistCount} size="small">
                  <Link href="/yeu-thich">
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      size="large"
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center"
                      style={{ border: "none", padding: "0 8px", height: "40px" }}
                    />
                  </Link>
                </Badge>
              </div>

              {/* Notifications - hidden on mobile */}
              <div className="relative hidden md:block">
                <Badge count={notificationCount} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    size="large"
                    className="text-gray-600 hover:text-gray-800 flex items-center justify-center"
                    style={{ border: "none", padding: "0 8px", height: "40px" }}
                  />
                </Badge>
              </div>

              {/* User account */}
              {isLoggedIn ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <Button 
                    type="text" 
                    size="large" 
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                    style={{ border: "none", padding: "0 8px", height: "40px" }}
                  >
                    <Space>
                      <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#e6f4ff", color: "#1890ff" }}
                      />
                      <span className="hidden md:inline">Tài khoản</span>
                      <DownOutlined style={{ fontSize: "12px" }} />
                    </Space>
                  </Button>
                </Dropdown>
              ) : (
                <Link href="/dang-nhap">
                  <Button 
                    type="text" 
                    size="large" 
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                    style={{ border: "none", padding: "0 8px", height: "40px" }}
                  >
                    <Space>
                      <UserOutlined />
                      <span className="hidden md:inline">Đăng nhập</span>
                    </Space>
                  </Button>
                </Link>
              )}

              {/* Shopping cart */}
              <div className="relative">
                <Badge count={cartCount} size="small">
                  <Link href="/gio-hang">
                    <Button
                      type="text"
                      icon={<ShoppingCartOutlined />}
                      size="large"
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center"
                      style={{ border: "none", padding: "0 8px", height: "40px" }}
                    />
                  </Link>
                </Badge>
              </div>
            </div>
          </div>

          {/* Search bar for mobile */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                size="middle"
                className="w-full"
                style={{ boxShadow: "none" }}
              />
            </div>
          </div>

          {/* Second row: Main navigation - hidden on mobile */}
          <nav className="hidden md:block border-t border-gray-100 pt-3">
            <Menu
              mode="horizontal"
              items={mainMenuItems}
              style={{ 
                border: "none",
                justifyContent: "center",
                backgroundColor: "transparent"
              }}
              className="text-gray-600 flex justify-center"
            />
          </nav>
        </div>
      </header>

      {/* Mobile drawer menu */}
      <Drawer
        title={<span className="text-gray-800">Menu</span>}
        placement="left"
        onClose={onClose}
        open={visible}
        width={280}
        styles={{
          header: {
            borderBottom: "1px solid #f0f0f0",
            padding: "16px 24px",
          },
          body: {
            padding: "24px",
          },
        }}
      >
        <div className="mb-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded">
              <Avatar
                icon={<UserOutlined />}
                size="large"
                style={{ backgroundColor: "#e6f4ff", color: "#1890ff" }}
              />
              <div>
                <div className="font-medium text-gray-800">Người dùng</div>
                <Link href="/profile" className="text-blue-500 text-sm">
                  Xem tài khoản
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mb-4">
              <Link href="/dang-nhap" className="flex-1">
                <Button type="primary" block>
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/dang-ky" className="flex-1">
                <Button block>Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>

        <Menu
          mode="vertical"
          items={mobileMenuItems}
          style={{ border: "none" }}
          expandIcon={({ isOpen }) => <DownOutlined rotate={isOpen ? 180 : 0} />}
          className="text-gray-700"
        />

        {isLoggedIn && (
          <>
            <div className="border-t my-4 pt-4 border-gray-100">
              <h4 className="mb-2 text-gray-500 font-medium">Tài khoản của tôi</h4>
              <Menu
                mode="vertical"
                items={[
                  { key: "profile", label: <Link href="/profile">Thông tin cá nhân</Link> },
                  { key: "orders", label: <Link href="/orders">Đơn hàng của tôi</Link> },
                  { key: "wishlist", label: <Link href="/yeu-thich">Danh sách yêu thích</Link> },
                  { key: "logout", label: <a onClick={() => setIsLoggedIn(false)}>Đăng xuất</a> },
                ]}
                style={{ border: "none" }}
                className="text-gray-700"
              />
            </div>
          </>
        )}

        <div className="border-t my-4 pt-4 border-gray-100">
          <h4 className="mb-2 text-gray-500 font-medium">Liên hệ</h4>
          <div className="text-sm text-gray-500">
            <div className="mb-2">Hotline: 1900 1234</div>
            <div className="mb-2">Email: contact@jupiter.vn</div>
            <div>Thời gian: 8h - 22h, T2 - CN</div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;