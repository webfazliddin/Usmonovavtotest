// @ts-nocheck

// Using relative path to fix Vite path resolution issue
const modules = import.meta.glob("./components/**/*.vue", { eager: true });

export default function loadComponents(app: any) {
  for (const path in modules) {
    const componentName: string = path.split("/").at(-1).split(".")[0];

    // Skip CustomNotification as it's already statically imported in App.vue
    if (componentName === "CustomNotification") {
      continue;
    }

    // Register component
    app.component(`${componentName}`, modules[path].default);
  }
}
