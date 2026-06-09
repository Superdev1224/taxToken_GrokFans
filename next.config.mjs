/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // WalletConnect → pino optionally requires pino-pretty (dev-only, not bundled)
    config.resolve.alias = {
      ...config.resolve.alias,
      "pino-pretty": false,
    };

    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
};

export default nextConfig;
