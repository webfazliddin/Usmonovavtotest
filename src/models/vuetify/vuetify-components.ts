import { Anchor, Density, LocationStrategyData, ScrollStrategyData, StrategyProps, StrategyProps$1, ValidationRule } from "./vuetifyTypes";
import * as vue_router from "vue-router";
import { Component, EffectScope, Ref, StyleValue, TransitionProps } from "vue";

export interface VCheckboxTypes {
  modelValue: any;
  label?: any;
  required?: boolean;
  error?: boolean | undefined;
  direction?: "horizontal" | "vertical" | undefined;
  style?: StyleValue | undefined;
  disabled?: boolean | undefined;
  multiple?: boolean | null | undefined;
  readonly?: boolean | undefined;
  indeterminate?: boolean | undefined;
  messages?: string | readonly string[] | undefined;
  density?: Density | undefined;
  ripple?: boolean | undefined;
  falseIcon?: any;
  trueIcon?: any;
  indeterminateIcon?: any;
  focused?: boolean | undefined;
  errorMessages?: string | readonly string[] | undefined;
  maxErrors?: string | number | undefined;
  rules?: readonly ValidationRule[] | undefined;
  centerAffix?: boolean | undefined;
  persistentHint?: boolean | undefined;
  type?: string | undefined;
  key?: string | number | symbol | undefined;
  id?: string | undefined;
  name?: string | undefined;
  color?: string | undefined;
  class?: any;
  validateOn?:
    | "lazy"
    | ("input" | "blur" | "submit")
    | "input lazy"
    | "blur lazy"
    | "submit lazy"
    | "lazy input"
    | "lazy blur"
    | "lazy submit"
    | undefined;
}

export interface VFormInputTypes {
  flat?: boolean | undefined;
  reverse?: boolean | undefined;
  type?: string | undefined;
  error?: boolean | undefined;
  active?: boolean | undefined;
  direction?: "horizontal" | "vertical" | undefined;
  style?: StyleValue | undefined;
  autofocus?: boolean | undefined;
  disabled?: boolean | undefined;
  readonly?: boolean | null | undefined;
  messages?: string | readonly string[] | undefined;
  rounded?: string | number | boolean | undefined;
  density?: Density | undefined;
  variant?: "filled" | "outlined" | "plain" | "underlined" | "solo" | "solo-inverted" | "solo-filled" | undefined;
  clearIcon?: any;
  focused?: boolean | undefined;
  errorMessages?: string | readonly string[] | undefined;
  maxErrors?: string | number | undefined;
  rules?: readonly ValidationRule[] | undefined;
  centerAffix?: boolean | undefined;
  persistentHint?: boolean | undefined;
  clearable?: boolean | undefined;
  dirty?: boolean | undefined;
  persistentClear?: boolean | undefined;
  singleLine?: boolean | undefined;
  persistentPlaceholder?: boolean | undefined;
  persistentCounter?: boolean | undefined;
  key?: string | number | symbol | undefined;
  id?: string | undefined;
  name?: string | undefined;
  color?: string | undefined;
  loading?: string | boolean | undefined;
  label?: string | undefined;
  prefix?: string | undefined;
  class?: any;
  placeholder?: string | undefined;
  mask?: string;
  canAddZero?: any;
  hideStar?: any;
  upperCase?: any;
  modelValue?: any;
  required?: boolean;
  appendInnerIcon?: any;
  prependInnerIcon?: any;
  hideDetails?: boolean | "auto" | undefined;
  bgColor?: string | undefined;
  baseColor?: string | undefined;
  suffix?: string | undefined;
  autocomplete?: string | undefined;
  modelModifiers?: Record<string, boolean> | undefined;
  validateOn?:
    | "lazy"
    | ("input" | "blur" | "submit")
    | "input lazy"
    | "blur lazy"
    | "submit lazy"
    | "lazy input"
    | "lazy blur"
    | "lazy submit"
    | undefined;
}

export interface VFormSelectTypes {
  list: any;
  modelValue?: any;
  label?: string;
  itemTitle?: any;
  itemValue?: any;
  variant?: "outlined" | "plain" | "filled" | "underlined" | "solo" | "solo-inverted" | "solo-filled" | undefined;
  color?: string;
  size?: string;
  multiple?: boolean;
  hideDetails?: boolean;
  chips?: boolean;
  clearable?: boolean;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  hideStar?: boolean;
  rules?: any;
  noFilter?: boolean;
  clearIcon?: any;
  menuIcon?: any;
  prependIcon?: any;
  appendIcon?: any;
  prependInnerIcon?: any;
  noSearch?: boolean;
  validateOn?:
    | "lazy"
    | ("input" | "blur" | "submit")
    | "input lazy"
    | "blur lazy"
    | "submit lazy"
    | "lazy input"
    | "lazy blur"
    | "lazy submit"
    | undefined;
  returnObject?: boolean;
}

export interface VMenuTypes {
  absolute?: boolean | undefined;
  location?: Anchor | undefined;
  origin?: "auto" | Anchor | "overlap" | undefined;
  transition?:
    | string
    | boolean
    | (TransitionProps & {
        component?: Component | undefined;
      })
    | undefined;
  zIndex?: string | number | undefined;
  style?: StyleValue | undefined;
  eager?: boolean | undefined;
  disabled?: boolean | undefined;
  modelValue?: boolean | undefined;
  locationStrategy?:
    | "connected"
    | "static"
    | ((
        data: LocationStrategyData,
        props: StrategyProps,
        contentStyles: Ref<Record<string, string>>
      ) =>
        | {
            updateLocation: (e: Event) => void;
          }
        | undefined)
    | undefined;
  scrollStrategy?:
    | "none"
    | "block"
    | "close"
    | ((data: ScrollStrategyData, props: StrategyProps$1, scope: EffectScope) => void)
    | "reposition"
    | undefined;
  activatorProps?: Record<string, any> | undefined;
  openOnClick?: boolean | undefined;
  openOnHover?: boolean | undefined;
  openOnFocus?: boolean | undefined;
  closeOnContentClick?: boolean | undefined;
  closeOnBack?: boolean | undefined;
  contained?: boolean | undefined;
  noClickAnimation?: boolean | undefined;
  persistent?: boolean | undefined;
  scrim?: string | boolean | undefined;
  _disableGlobalStack?: boolean | undefined;
  offset?: string | number | number[] | undefined;
  key?: string | number | symbol | undefined;
  height?: string | number | undefined;
  width?: string | number | undefined;
  maxHeight?: string | number | undefined;
  maxWidth?: string | number | undefined;
  minHeight?: string | number | undefined;
  minWidth?: string | number | undefined;
  class?: any;
  onAfterLeave?: (() => any) | undefined;
}

export interface VBtn {
  loading?: string | boolean | undefined;
  position?: "fixed" | "absolute" | "static" | "relative" | "sticky" | undefined;
  color?: string | undefined;
  location?: Anchor | undefined;
  border?: string | number | boolean | undefined;
  elevation?: string | number | undefined;
  to?: vue_router.RouteLocationRaw | undefined;
  prependIcon?: any;
  appendIcon?: any;
  density?: Density;
  active?: boolean;
  exact?: boolean;
  block?: boolean;
  disabled?: boolean;
  btnIcon?: any;
  flat?: boolean;
  replace?: boolean;
  stacked?: boolean;
  height?: string | number;
  ripple?:
    | boolean
    | {
        class: string;
      }
    | undefined;

  size?: number;
  rounded?: string | number | boolean | undefined;
  tag?: string;
}
