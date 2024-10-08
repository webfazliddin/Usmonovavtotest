import type { ComponentInternalInstance, InjectionKey, PropType, Ref, VNodeChild } from "vue";

export function toKebabCase(str = "") {
  if (toKebabCase.cache.has(str)) return toKebabCase.cache.get(str)!;
  const kebab = str
    .replace(/[^a-z]/gi, "-")
    .replace(/\B([A-Z])/g, "-$1")
    .toLowerCase();
  toKebabCase.cache.set(str, kebab);
  return kebab;
}
toKebabCase.cache = new Map<string, string>();

export type MaybeRef<T> = T | Ref<T>;

export type EventProp<T extends any[] = any[], F = (...args: T) => void> = F;
export const EventProp = <T extends any[] = any[]>() => [Function, Array] as PropType<EventProp<T>>;
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
export function wrapInArray<T>(v: T | null | undefined): T extends readonly any[] ? IfAny<T, T[], T> : NonNullable<T>[] {
  return v == null ? [] : Array.isArray(v) ? (v as any) : [v];
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date && a.getTime() !== b.getTime()) {
    // If the values are Date, compare them as timestamps
    return false;
  }

  if (a !== Object(a) || b !== Object(b)) {
    // If the values aren't objects, they were already checked for equality
    return false;
  }

  const props = Object.keys(a);

  if (props.length !== Object.keys(b).length) {
    // Different number of props, don't bother to check
    return false;
  }

  return props.every((p) => deepEqual(a[p], b[p]));
}

export function findChildrenWithProvide(key: InjectionKey<any> | symbol, vnode?: VNodeChild): ComponentInternalInstance[] {
  if (!vnode || typeof vnode !== "object") return [];

  if (Array.isArray(vnode)) {
    return vnode.map((child) => findChildrenWithProvide(key, child)).flat(1);
  } else if (Array.isArray(vnode.children)) {
    return vnode.children.map((child) => findChildrenWithProvide(key, child)).flat(1);
  } else if (vnode.component) {
    // @ts-ignore
    if (Object.getOwnPropertySymbols(vnode.component.provides).includes(key as symbol)) {
      return [vnode.component];
    } else if (vnode.component.subTree) {
      return findChildrenWithProvide(key, vnode.component.subTree).flat(1);
    }
  }

  return [];
}

export function keys<O extends {}>(o: O) {
  return Object.keys(o) as (keyof O)[];
}

export function isObject(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

export function mergeDeep(source: Record<string, any> = {}, target: Record<string, any> = {}, arrayFn?: (a: unknown[], b: unknown[]) => unknown[]) {
  const out: Record<string, any> = {};

  for (const key in source) {
    out[key] = source[key];
  }

  for (const key in target) {
    const sourceProperty = source[key];
    const targetProperty = target[key];

    // Only continue deep merging if
    // both properties are objects
    if (isObject(sourceProperty) && isObject(targetProperty)) {
      out[key] = mergeDeep(sourceProperty, targetProperty, arrayFn);

      continue;
    }

    if (Array.isArray(sourceProperty) && Array.isArray(targetProperty) && arrayFn) {
      out[key] = arrayFn(sourceProperty, targetProperty);

      continue;
    }

    out[key] = targetProperty;
  }

  return out;
}

type MaybePick<T extends object, U extends Extract<keyof T, string>> = Record<string, unknown> extends T ? Partial<Pick<T, U>> : Pick<T, U>;

// Array of keys
export function pick<T extends object, U extends Extract<keyof T, string>>(obj: T, paths: U[]): MaybePick<T, U> {
  const found: any = {};

  const keys = new Set(Object.keys(obj));
  for (const path of paths) {
    if (keys.has(path)) {
      found[path] = obj[path];
    }
  }

  return found;
}
