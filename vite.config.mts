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
        styles: { configFile: "src/app/styles/_variables.scss" }
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
      open: true,
      // Performance optimizations for dev server
      warmup: {
        clientFiles: ['./src/App.vue', './src/main.ts', './src/app.ts']
      }
    },
    build: {
      minify: true,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Better code splitting for optimal loading
            if (id.includes("node_modules")) {
              // Split large libraries into separate chunks
              if (id.includes("vuetify")) {
                return "vuetify";
              }
              if (id.includes("vue-router")) {
                return "vue-router";
              }
              if (id.includes("pinia")) {
                return "pinia";
              }
              if (id.includes("axios")) {
                return "axios";
              }
              if (id.includes("@mdi")) {
                return "mdi-icons";
              }
              // Other vendor dependencies
              return "vendor";
            }
            if (id.includes("ckeditor5")) {
              return "ckeditor";
            }
          }
        }
      }
    },
    ssr: {},
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "axios", "vuetify"],
      entries: ["./src/**/*.vue"]
    }
  };
});
