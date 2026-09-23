import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so an unrelated lockfile in the
  // home directory doesn't get picked up during dev/build.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // GitHub avatars are rendered via <img>, so no next/image domain config needed.
};

export default nextConfig;
