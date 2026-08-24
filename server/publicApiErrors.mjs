/**
 * Structured JSON errors for public API routes.
 */
export const PUBLIC_API_ERROR_CODES = {
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
}

export function publicApiErrorBody(code, message, resolution) {
  return {
    error: {
      code,
      message,
      resolution,
    },
  }
}

export function sendPublicApiError(res, code, message, resolution, status = 400) {
  res.set({
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.status(status).json(publicApiErrorBody(code, message, resolution))
}

export function notFoundError(res, message = 'The requested resource was not found.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.RESOURCE_NOT_FOUND,
    message,
    'Check the request path or consult /llms.txt.',
    404,
  )
}

export function serviceUnavailableError(res, message = 'This service is temporarily unavailable.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.SERVICE_UNAVAILABLE,
    message,
    'Retry later or consult /llms.txt.',
    503,
  )
}

export function internalError(res, message = 'An unexpected error occurred.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.INTERNAL_ERROR,
    message,
    'Retry later or consult /llms.txt.',
    500,
  )
}
