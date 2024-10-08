import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

const virtualFile = "@virtual-file";
const virtualId = "\0" + virtualFile;
const nestedVirtualFile = "@nested-virtual-file";
const nestedVirtualId = "\0" + nestedVirtualFile;

const base = "/";

globalThis.__vite_test_filename = __filename;
globalThis.__vite_test_dirname = __dirname;

export default defineConfig(({ mode, command, isSsrBuild }) => {
  return {
    base,
    plugins: [
      vue(),
      {
        name: "virtual",
        resolveId(id) {
          if (id === "@foo") {
            return id;
          }
        },
        load(id, options) {
          const ssrFromOptions = options?.ssr ?? false;
          if (id === "@foo") {
            return `export default { msg: '${
              command === "build" && !!isSsrBuild !== ssrFromOptions
                ? `defineConfig ssrBuild !== ssr from load options`
                : "hi"
            }' }`;
          }
        },
      },
      {
        name: "virtual-module",
        resolveId(id) {
          if (id === virtualFile) {
            return virtualId;
          } else if (id === nestedVirtualFile) {
            return nestedVirtualId;
          }
        },
        load(id) {
          if (id === virtualId) {
            return `export { msg } from "@nested-virtual-file";`;
          } else if (id === nestedVirtualId) {
            return `export const msg = "[success] from conventional virtual file"`;
          }
        },
      },
      (function () {
        const queryRE = /\?.*$/s;
        const hashRE = /#.*$/s;
        const cleanUrl = (url) => url.replace(hashRE, "").replace(queryRE, "");
        let config;

        const virtualId = "\0virtual:ssr-vue-built-url";
        return {
          name: "built-url",
          enforce: "post",
          configResolved(_config) {
            config = _config;
          },
          resolveId(id) {
            if (id === virtualId) {
              return id;
            }
          },
          load(id) {
            if (id === virtualId) {
              return {
                code: `export const __ssr_vue_processAssetPath = (url) => '${base}' + url`,
                moduleSideEffects: "no-treeshake",
              };
            }
          },
          transform(code, id) {
            const cleanId = cleanUrl(id);
            if (
              config.build.ssr &&
              (cleanId.endsWith(".js") || cleanId.endsWith(".vue")) &&
              !code.includes("__ssr_vue_processAssetPath")
            ) {
              return {
                code:
                  `import { __ssr_vue_processAssetPath } from '${virtualId}';__ssr_vue_processAssetPath;` +
                  code,
                sourcemap: null,
              };
            }
          },
        };
      })(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },

    server: {
      host: "0.0.0.0",
      port: 5027,
      open: true,
      // strictPort: true,
    },
    build: {
      minify: true,
      chunkSizeWarningLimit: 1600,
    },

    ssr: {},
    optimizeDeps: {
      exclude: ["vuetify"],
      entries: ["./src/**/*.vue"],
    },
  };
});
