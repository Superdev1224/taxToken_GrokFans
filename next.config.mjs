/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for VPS hosting — outputs plain HTML/JS/CSS to out/
  output: "export",
  // Generates tree/index.html instead of tree.html so nginx/apache serve clean URLs
  trailingSlash: true,
  webpack: (config) => {
    // Stub optional wallet SDK peers from @wagmi/connectors (via Reown adapter)
    const optionalPeerStubs = [
      "porto",
      "porto/internal",
      "accounts",
      "@metamask/connect-evm",
      "@metamask/sdk",
      "@coinbase/wallet-sdk",
      "@gemini-wallet/core",
      "@react-native-async-storage/async-storage",
      "@safe-global/safe-apps-sdk",
      "@safe-global/safe-apps-provider",
    ];

    config.resolve.alias = {
      ...config.resolve.alias,
      "pino-pretty": false,
      ...Object.fromEntries(optionalPeerStubs.map((id) => [id, false])),
    };

    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
};

export default nextConfig;
