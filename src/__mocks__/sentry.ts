// Mock Sentry module to prevent import-in-the-middle hooks
export const setupFastifyErrorHandler = () => {};
export const init = () => {};
export const logger = {
  error: () => {},
  info: () => {},
  warn: () => {},
};
export const metrics = {
  count: () => {},
};
