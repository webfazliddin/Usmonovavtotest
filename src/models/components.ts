export interface FormInputTypes {
  modelValue?: any;
  required?: boolean;
  rules?: any[];
  label?: string;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  name?: string;
  mask?: string | any;
  maxLength?: string | number;
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
  type?: string | undefined;
  append?: boolean | undefined;
  appendText?: string | undefined;
  appendLoading?: boolean | undefined;
  prependText?: string | null | undefined;
  hasBorder?: boolean;
  size?: "sm" | "md" | "sm:md";
}
