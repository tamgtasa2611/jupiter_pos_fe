import { AntdRegistry } from "@ant-design/nextjs-registry";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "antd";
import themeConfig from "@config/themeConfig";
import Script from "next/script";
import viVN from "antd/locale/vi_VN";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Phần mềm quản lý bán hàng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script id="mobile-redirect-script" strategy="beforeInteractive">{`
  (function() {
    
    // Allow the script to initialize fully before checking width
    setTimeout(function() {
      try {
        // *** SIMPLIFIED: Only check screen width ***
        function isMobileWidth() {
          var width = window.innerWidth;
          return width < 1024;
        }
        
        function forceRedirect(url) {
       
          // Use replace instead of href for cleaner history
          window.location.replace(url);
        }
        
        function handleRedirect(isResizeEvent) {
          var currentPath = window.location.pathname;
         
          
          // Skip redirect loop prevention for resize events
          var redirectAttempted = false;
          if (!isResizeEvent) {
            try {
              redirectAttempted = sessionStorage.getItem('redirect_attempted') === 'true';
             
            } catch (storageErr) {
             
            }
          }
          
          if (redirectAttempted && !isResizeEvent) {
           
            try {
              sessionStorage.removeItem('redirect_attempted');
            } catch (e) {}
            return false;
          }
          
          var isNarrowScreen = isMobileWidth();
          
          // Narrow screen but not on mobile path
          if (isNarrowScreen && !currentPath.startsWith('/m/')) {
       
            try {
              sessionStorage.setItem('redirect_attempted', 'true');
            } catch (e) {}
            
            var newPath = currentPath === '/' ? '/m' : '/m' + currentPath;
            
            // Use clean URL without query parameters
          
            forceRedirect(newPath);
            return true;
          }
          
          // Wide screen but on mobile path
          else if (!isNarrowScreen && currentPath.startsWith('/m/')) {
           
            try {
              sessionStorage.setItem('redirect_attempted', 'true');
            } catch (e) {}
            
            var desktopPath = currentPath.replace('/m', '') || '/';
            
            // Use clean URL without query parameters
      
            forceRedirect(desktopPath);
            return true;
          }
          else {
           
            return false;
          }
        }
        
        // Run the initial redirect check
        var initialRedirectDone = handleRedirect(false);
        
        // Store whether we're in narrow screen mode
        var isCurrentlyInNarrowMode = isMobileWidth();
 
        
        // Set up resize detection with minimal delay
        if (!initialRedirectDone) {
          var resizeTimeout;
          
          // Track if a reload has been triggered in this session
          var reloadTriggered = false;
          
          window.addEventListener('resize', function() {
            // Clear previous timeout
            if (resizeTimeout) clearTimeout(resizeTimeout);
            
            // Use a very short debounce time
            resizeTimeout = setTimeout(function() {
              var isNarrowNow = isMobileWidth();
              
              // Only redirect if we crossed the width threshold
              if (isNarrowNow !== isCurrentlyInNarrowMode && !reloadTriggered) {
             
                
                // Set reload flag to prevent multiple reloads
                reloadTriggered = true;
                
                // FORCE PAGE RELOAD instead of redirect logic
           
                
                // Add flag in sessionStorage to indicate resize-based reload
                try {
                  sessionStorage.setItem('resize_reload', 'true');
                } catch (e) {}
                
                // Force full page reload
                window.location.reload();
                
              } else {
              
              }
            }, 250); // Slightly longer debounce for better UX
          });
          
        }
        
        // Remove reload flag once page has loaded
        try {
          if (sessionStorage.getItem('resize_reload') === 'true') {
          
            sessionStorage.removeItem('resize_reload');
          }
        } catch (e) {}
        
      } catch (e) {
        console.error("❌ Redirect script error:", e);
      }
    }, 100); // Short delay to ensure window is ready
  })();
`}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider theme={themeConfig} locale={viVN}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
