/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
    images: {
        // OR (less secure)
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**', // Allows all HTTPS domains
          },
        ],
      },
};

export default config;
