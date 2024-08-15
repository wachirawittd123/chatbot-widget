/** @type {import('next').NextConfig} */
import TerserPlugin from "terser-webpack-plugin"
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: true,
            mangle: true,
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
