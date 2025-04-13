// import { NextResponse } from "next/server";

// // Define mobile device detection
// function isMobileDevice(userAgent) {
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
// }

// export function middleware(request) {
//   // Get user agent string
//   const userAgent = request.headers.get("user-agent") || "";
//   const url = request.nextUrl.clone();
//   const isMobile = isMobileDevice(userAgent);
//   const currentPath = url.pathname;

//   // At the top of your middleware function
//   console.log("⚙️ Middleware running");
//   console.log("📱 User agent:", userAgent);
//   console.log("🔍 Is mobile:", isMobile);
//   console.log("🌐 Current path:", currentPath);

//   // Skip redirects for API routes, static files, and favicon
//   if (
//     currentPath.startsWith("/_next") ||
//     currentPath.startsWith("/api") ||
//     currentPath.includes(".") ||
//     currentPath === "/favicon.ico"
//   ) {
//     return NextResponse.next();
//   }

//   // Mobile device but not on mobile path
//   if (isMobile && !currentPath.startsWith("/m/")) {
//     // Special case for root
//     if (currentPath === "/") {
//       url.pathname = "/m";
//     } else {
//       url.pathname = `/m${currentPath}`;
//     }

//     // Create response with proper status code for temporary redirect
//     const response = NextResponse.redirect(url, 307);

//     // Add cache control headers to prevent caching of the redirect
//     response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
//     response.headers.set("Pragma", "no-cache");
//     response.headers.set("Expires", "0");

//     // Add custom header for debugging
//     response.headers.set("X-Redirect-Reason", "Mobile device detected");

//     return response;
//   }

//   // Desktop device but on mobile path
//   if (!isMobile && currentPath.startsWith("/m/")) {
//     url.pathname = currentPath.replace("/m", "") || "/";

//     // Create response with proper status code for temporary redirect
//     const response = NextResponse.redirect(url, 307);

//     // Add cache control headers to prevent caching of the redirect
//     response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
//     response.headers.set("Pragma", "no-cache");
//     response.headers.set("Expires", "0");

//     // Add custom header for debugging
//     response.headers.set("X-Redirect-Reason", "Desktop device on mobile path");

//     return response;
//   }

//   // For non-redirected requests, add a client-side meta refresh as a fallback
//   // This ensures redirection even if middleware fails for some reason
//   if (
//     (isMobile && !currentPath.startsWith("/m/")) ||
//     (!isMobile && currentPath.startsWith("/m/"))
//   ) {
//     const response = NextResponse.next();
//     response.headers.set("X-Check-Redirect", "true");
//     return response;
//   }

//   console.log(`Middleware running: Path=${currentPath}, isMobile=${isMobile}`);
//   return NextResponse.next();
// }

// // Configure which paths the middleware runs on
// export const config = {
//   matcher: [
//     /*
//      * Match all paths except for:
//      * 1. /api routes
//      * 2. /_next (Next.js internals)
//      * 3. .*\\..*$ (files with extensions, e.g. favicon.ico)
//      */
//     "/((?!api|_next|.*\\..*$).*)",
//   ],
// };
