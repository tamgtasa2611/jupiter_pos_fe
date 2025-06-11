/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  //   images: { unoptimized: true },
  distDir: "out",
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/:path*/index.txt",
        destination: "/404",
      },
    ];
  },
};

export default nextConfig;
