import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

const base = "/";

globalThis.__vite_test_filename = __filename;
globalThis.__vite_test_dirname = __dirname;

export default defineConfig(({}) => {
  return {
    base,
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
        styles: { configFile: "src/app/styles/variables.scss" }
      }),
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: "0.0.0.0",
      port: 5027,
      open: true
    },
    build: {
      minify: true,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor"; // Separate vendor chunk for node_modules
            }
            if (id.includes("ckeditor5")) {
              return "ckeditor"; // Separate chunk for CKEditor-related files
            }
          }
        }
      }
    },
    ssr: {},
    optimizeDeps: {
      exclude: ["vuetify"], // Exclude Vuetify from optimization if needed
      entries: ["./src/**/*.vue"]
    }
  };
});
