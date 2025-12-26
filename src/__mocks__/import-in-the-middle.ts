// Empty mock to prevent import-in-the-middle from registering hooks
export const Hook = class {};
export const addHook = () => {};
export const createHook = () => ({});
export default { addHook, createHook, Hook };
