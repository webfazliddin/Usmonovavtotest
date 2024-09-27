import { Component, EffectScope, Ref } from "vue";

export declare const block: readonly ["top", "bottom"];
export declare const inline: readonly ["start", "end", "left", "right"];
export type Tblock = (typeof block)[number];
export type Tinline = (typeof inline)[number];
export interface ScrollStrategyData {
  root: Ref<HTMLElement | undefined>;
  contentEl: Ref<HTMLElement | undefined>;
  activatorEl: Ref<HTMLElement | undefined>;
  isActive: Ref<boolean>;
  updateLocation: Ref<((e: Event) => void) | undefined>;
}

export type Anchor = Tblock | Tinline | "center" | "center center" | `${Tblock} ${Tinline | "center"}` | `${Tinline} ${Tblock | "center"}`;

export type ScrollStrategyFn = (data: ScrollStrategyData, props: StrategyProps$1, scope: EffectScope) => void;
export declare const scrollStrategies: {
  none: null;
  close: typeof closeScrollStrategy;
  block: typeof blockScrollStrategy;
  reposition: typeof repositionScrollStrategy;
};
export declare const locationStrategies: {
  static: typeof staticLocationStrategy;
  connected: typeof connectedLocationStrategy;
};
export interface LocationStrategyData {
  contentEl: Ref<HTMLElement | undefined>;
  activatorEl: Ref<HTMLElement | undefined>;
  isActive: Ref<boolean>;
  isRtl: Ref<boolean>;
}
export declare function connectedLocationStrategy(
  data: LocationStrategyData,
  props: StrategyProps,
  contentStyles: Ref<Record<string, string>>
): {
  updateLocation: () =>
    | {
        available: {
          x: number;
          y: number;
        };
        contentBox: Box;
      }
    | undefined;
};
export declare class Box {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor({ x, y, width, height }: { x: number; y: number; width: number; height: number });
  get top(): number;
  get bottom(): number;
  get left(): number;
  get right(): number;
}

export declare function staticLocationStrategy(): void;
export declare function closeScrollStrategy(data: ScrollStrategyData): void;
export declare function blockScrollStrategy(data: ScrollStrategyData, props: StrategyProps$1): void;
export declare function repositionScrollStrategy(data: ScrollStrategyData, props: StrategyProps$1, scope: EffectScope): void;
export type LocationStrategyFn = (
  data: LocationStrategyData,
  props: StrategyProps,
  contentStyles: Ref<Record<string, string>>
) =>
  | undefined
  | {
      updateLocation: (e: Event) => void;
    };
export interface StrategyProps {
  locationStrategy: keyof typeof locationStrategies | LocationStrategyFn;
  location: Anchor;
  origin: Anchor | "auto" | "overlap";
  offset?: number | string | number[];
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
}

export interface StrategyProps$1 {
  scrollStrategy: keyof typeof scrollStrategies | ScrollStrategyFn;
  contained: boolean | undefined;
}

export type ValidationResult = string | boolean;
export type Density = null | "default" | "comfortable" | "compact";
export type ValidationRule =
  | ValidationResult
  | PromiseLike<ValidationResult>
  | ((value: any) => ValidationResult)
  | ((value: any) => PromiseLike<ValidationResult>);
export type IconValue = string | (string | [path: string, opacity: number])[] | Component;
