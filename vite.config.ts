import { rmSync } from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import path from "node:path";
import pkg from "./package.json";

rmSync("dist-electron", { recursive: true, force: true });

const isDevelopment =
  process.env.NODE_ENV === "development" || !!process.env.VSCODE_DEBUG;
const isProduction = process.env.NODE_ENV === "production";

const pathSrc = path.resolve(__dirname, "./ui/src");
const pathPackage = path.resolve(__dirname, "./ui/packages");
const pathCommon = path.resolve(__dirname, "./common");

export default defineConfig({
  resolve: {
    alias: {
      package: pathPackage,
      "@": pathSrc,
      "~": pathCommon,
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  plugins: [
    vue(),
    electron([
      {
        entry: "electron/main/index.ts",
        onstart(options) {
          options.startup();
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: "dist-electron/main",
            rollupOptions: {
              external: Object.keys(
                "dependencies" in pkg ? pkg.dependencies : {},
              ),
            },
          },
        },
      },
      {
        entry: "electron/preload/index.ts",
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: "dist-electron/preload",
            rollupOptions: {
              external: Object.keys(
                "dependencies" in pkg ? pkg.dependencies : {},
              ),
            },
          },
        },
      },
    ]),
    renderer({}),
  ],
  server: !!process.env.VSCODE_DEBUG
    ? (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })()
    : undefined,
  clearScreen: false,
});
