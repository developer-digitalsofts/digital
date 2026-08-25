/**
 * Structured JSON errors for public API routes.
 */
export const PUBLIC_API_ERROR_CODES = {
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  CONFLICT: 'CONFLICT',
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
    'Check the request path or consult /developers and /openapi.json.',
    404,
  )
}

export function validationError(res, message = 'The request body or parameters are invalid.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.VALIDATION_ERROR,
    message,
    'Review the request against /openapi.json or /developers.',
    400,
  )
}

export function rateLimitedError(res, message = 'Too many requests. Please wait before retrying.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.RATE_LIMITED,
    message,
    'Wait a few minutes before submitting again.',
    429,
  )
}

export function conflictError(res, message = 'The request conflicts with a recent submission.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.CONFLICT,
    message,
    'Wait a few minutes or contact us via /contact.',
    409,
  )
}

export function serviceUnavailableError(res, message = 'This service is temporarily unavailable.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.SERVICE_UNAVAILABLE,
    message,
    'Retry later or consult /developers.',
    503,
  )
}

export function internalError(res, message = 'An unexpected error occurred.') {
  sendPublicApiError(
    res,
    PUBLIC_API_ERROR_CODES.INTERNAL_ERROR,
    message,
    'Retry later or consult /developers.',
    500,
  )
}

/** Locale content 404 with optional meta/fallback (preserves existing clients). */
export function localeContentNotFound(res, payload) {
  res.set({
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.status(404).json({
    ...publicApiErrorBody(
      PUBLIC_API_ERROR_CODES.RESOURCE_NOT_FOUND,
      'Localized content is not published for this country and language.',
      'Try UAE English fallback or another published locale. See /openapi.json.',
    ),
    ...payload,
  })
}
