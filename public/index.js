if (typeof window !== "undefined") {
  const hasToken = localStorage.getItem("token");

  if (hasToken) {
    window.location.href = "/admin/ban-hang";
  } else {
    window.location.href = "/dang-nhap";
  }
}
