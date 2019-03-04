module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{txt,xml,png,svg,woff,woff2,ico,html,js,webmanifest,css}"],
  swDest: "dist/sw.js",
  clientsClaim: true,
  skipWaiting: true,
  navigateFallback: "/index.html",
  // Increase the limit to 4mb:
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
};
