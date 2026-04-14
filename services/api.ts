import axios from "axios";
import { API_BASE_URL } from "../constants/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// ✅ FIXED RETRY FUNCTION
export const fetchWithRetry = async (
  fn: any,
  retries = 5,
  delay = 10000
): Promise<any> => {
  try {
    return await fn();
  } catch (err: any) {
    console.log("API Error:", err?.message);

    // ❌ Do NOT retry client errors (400, 401, etc.)
    if (err?.response && err.response.status < 500) {
      throw err;
    }

    if (retries > 0) {
      console.log(`Retrying... (${retries})`);
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(fn, retries - 1, delay);
    }

    throw err;
  }
};

export default api;