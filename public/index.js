// Simple redirect to the appropriate page
if (typeof window !== 'undefined') {
  console.log("Initializing fallback entry point");
  
  // Check if token exists
  const hasToken = localStorage.getItem('token');
  
  if (hasToken) {
    window.location.href = '/admin/trang-chu';
  } else {
    window.location.href = '/dang-nhap';
  }
}