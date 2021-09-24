/**
 * Constant that defines whether the current device is mobile.
 */
export const isMobile =
  navigator?.userAgent.indexOf('Android') !== -1 ||
  navigator?.userAgent.indexOf('like Mac') !== -1
