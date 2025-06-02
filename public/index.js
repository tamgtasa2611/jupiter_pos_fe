// Simple redirect to the appropriate page
if (typeof window !== "undefined") {
  // Check if token exists
  const hasToken = localStorage.getItem("token");

  if (hasToken) {
    window.location.href = "/admin/ban-hang";
  } else {
    window.location.href = "/dang-nhap";
  }
}
