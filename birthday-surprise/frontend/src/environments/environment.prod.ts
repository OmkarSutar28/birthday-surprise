// Replace this with your actual Render backend URL after you deploy it,
// e.g. 'https://birthday-api-xxxx.onrender.com'
const BACKEND_URL = 'https://YOUR-RENDER-APP-NAME.onrender.com';

export const environment = {
  production: true,
  apiUrl: `${BACKEND_URL}/api`,
  photosBaseUrl: BACKEND_URL,
};
