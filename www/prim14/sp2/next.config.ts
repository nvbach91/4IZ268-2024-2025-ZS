import { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    output: "export",
    assetPrefix: isDev ? undefined : "https://eso.vse.cz/~prim14/sp2/",
    images: { unoptimized: true },
  };
};

export default nextConfig;
