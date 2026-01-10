// Development-only logging utility
// Production logs are automatically removed by Next.js compiler

export const logger = {
  /**
   * Log information (only in development)
   */
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },

  /**
   * Log errors (always logged)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(...args);
    }
  },

  /**
   * Group logs (only in development)
   */
  group: (label: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (process.env.NODE_ENV !== 'production') {
      console.groupEnd();
    }
  },
};
