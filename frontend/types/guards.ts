// Type Guards

import { Task } from './task'
import { APIError } from './api'
import { AuthResponse } from './auth'

export function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'completed' in value &&
    typeof (value as Task).id === 'string' &&
    typeof (value as Task).title === 'string' &&
    typeof (value as Task).completed === 'boolean'
  )
}

export function isAPIError(value: unknown): value is APIError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as APIError).error === 'object' &&
    'code' in (value as APIError).error &&
    'message' in (value as APIError).error
  )
}

export function isAuthResponse(value: unknown): value is AuthResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'user' in value &&
    'token' in value &&
    typeof (value as AuthResponse).token === 'string' &&
    typeof (value as AuthResponse).user === 'object'
  )
}
