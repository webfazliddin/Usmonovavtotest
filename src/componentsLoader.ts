// @ts-nocheck

const modules = import.meta.glob("@/components/**/*.vue", { eager: true });

export default function loadComponents(app: any) {
  for (const path in modules) {
    const componentName: string = path.split("/").at(-1).split(".")[0];
    app.component(`${componentName}`, modules[path].default);
  }
}
