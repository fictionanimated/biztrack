
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // Exclude server-only modules from client-side bundle
        config.resolve.fallback = {
            ...config.resolve.fallback,
            'mongodb-client-encryption': false,
            'aws4': false,
            'gcp-metadata': false,
            'kerberos': false,
            '@aws-sdk/credential-providers': false,
            'snappy': false,
            '@mongodb-js/zstd': false,
            'child_process': false,
            'fs': false,
        };
    }
    return config;
  },
};

export default nextConfig;
