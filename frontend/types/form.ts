// Form Types

export interface FormErrors {
  [key: string]: string | string[]
}

export interface FormState<T> {
  values: T
  errors: FormErrors
  isSubmitting: boolean
  isValid: boolean
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
}

export interface ValidationRules {
  [key: string]: ValidationRule
}
