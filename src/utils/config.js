export const APP_NAME = import.meta.env.VITE_APP_NAME;
export const APP_VERSION = import.meta.env.VITE_APP_VERSION;

const HOSTNAME = window.location.hostname;
export const IS_LOCAL = ["localhost", "127.0.0.1", "::1"].includes(HOSTNAME);
const ENV_BASE_URL = import.meta.env.VITE_BASE_URL;

const BASE_DOMAIN = IS_LOCAL ? ENV_BASE_URL : HOSTNAME;

export const BASE_URL = `https://api${BASE_DOMAIN}`;
export const URL_API = `${BASE_URL}/api`;
