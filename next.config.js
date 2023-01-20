/** @type {import('next').NextConfig} */
require("dotenv").config({ path: ".env" });
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PINATA_API_SECRET: process.env.PINATA_API_SECRET,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
   },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

module.exports = nextConfig
