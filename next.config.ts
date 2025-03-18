/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
};

export default nextConfig;
