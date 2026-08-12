export class TimeoutError extends Error {
  constructor(message = 'Task timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Wraps a promise with a timeout.
 * @param promise The original promise
 * @param ms Timeout in milliseconds
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${ms}ms`));
    }, ms);
    
    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

/**
 * Retries an async function with exponential backoff.
 * @param fn Function returning a promise
 * @param retries Maximum number of retries
 * @param delayMs Initial delay in milliseconds
 * @param factor Multiplier for the delay
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
  factor = 2
): Promise<T> {
  let lastError: any;
  let currentDelay = delayMs;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // If no retries left, throw immediately
      if (i === retries) {
        break;
      }
      
      console.warn(`[Retry ${i + 1}/${retries}] Failed: ${error.message}. Retrying in ${currentDelay}ms...`);
      await new Promise(res => setTimeout(res, currentDelay));
      currentDelay *= factor; // Exponential backoff
    }
  }
  
  throw lastError;
}
