/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Optimisation pour le hot reloading dans Docker
  webpack: (config: any) => {
    // Optimisation pour le hot reloading lorsqu'on utilise Docker
    config.watchOptions = {
      poll: 1000, // Vérifier les changements toutes les secondes
      aggregateTimeout: 300, // Attendre 300ms après un changement avant de rebuild
    };
    return config;
  },
};

export default nextConfig;
