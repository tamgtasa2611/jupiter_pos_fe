import { useCallback } from "react";

const useBarcodeScan = (setSearchText) => {
  const handleScanCode = useCallback(async () => {
    // Check if running in Capacitor environment (mobile app)
    const isNativeApp = typeof window !== "undefined" && window.Capacitor;

    // If running in Capacitor environment and the MLKit BarcodeScanning plugin is available
    if (isNativeApp && window.Capacitor.Plugins.BarcodeScanning) {
      try {
        const { BarcodeScanning } = window.Capacitor.Plugins;

        // Check permissions
        const { camera } = await BarcodeScanning.checkPermissions();

        if (camera !== "granted") {
          const { camera } = await BarcodeScanning.requestPermissions();
          if (camera !== "granted") {
            alert("Vui lòng cấp quyền truy cập camera để quét mã vạch.");
            return;
          }
        }

        // Start scanning
        const { barcodes } = await BarcodeScanning.scan({
          formats: [
            "QR_CODE",
            "EAN_13",
            "EAN_8",
            "UPC_A",
            "UPC_E",
            "CODE_39",
            "CODE_93",
            "CODE_128",
          ],
        });

        if (barcodes.length > 0) {
          console.log("Barcode data:", barcodes[0].rawValue);
          // Search for the product using the scanned barcode
          setSearchText(barcodes[0].rawValue);
        }
      } catch (error) {
        console.error("Barcode scanning error:", error);
        alert("Lỗi khi quét mã: " + error.message);
      }
    }
    // Fallback to browser-based scanner
    else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        // Create and show a modal with video element for scanning
        const videoModal = document.createElement("div");
        videoModal.style = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
          z-index: 9999;
        `;

        const video = document.createElement("video");
        video.style = `
          width: 100%;
          height: calc(100% - 60px);
          object-fit: cover;
        `;
        video.srcObject = stream;
        video.autoplay = true;

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Hủy";
        closeBtn.style = `
          padding: 12px;
          background: #f44336;
          color: white;
          border: none;
          height: 60px;
          font-size: 16px;
        `;

        closeBtn.onclick = () => {
          stream.getTracks().forEach((track) => track.stop());
          document.body.removeChild(videoModal);
        };

        videoModal.appendChild(video);
        videoModal.appendChild(closeBtn);
        document.body.appendChild(videoModal);

        // Load the browser-based barcode scanner (using ZXing library)
        try {
          // Use dynamic import to load ZXing only when needed
          const { BrowserMultiFormatReader } = await import("@zxing/library");

          const codeReader = new BrowserMultiFormatReader();
          codeReader
            .decodeFromVideoElement(video)
            .then((result) => {
              // Found a barcode
              if (result && result.text) {
                setSearchText(result.text);
                stream.getTracks().forEach((track) => track.stop());
                document.body.removeChild(videoModal);
              }
            })
            .catch((err) => {
              console.warn("Barcode detection error:", err);
              // Continue scanning
            });
        } catch (e) {
          console.error("Error loading barcode scanning library:", e);
          alert("Không thể tải thư viện quét mã vạch. Vui lòng thử lại sau.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Truy cập camera thất bại. Vui lòng cấp quyền truy cập camera.");
      }
    } else {
      alert("Thiết bị của bạn không hỗ trợ quét mã vạch.");
    }
  }, [setSearchText]);

  return { handleScanCode };
};

export default useBarcodeScan;
