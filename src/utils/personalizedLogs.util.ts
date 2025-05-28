export const Log = {
  info: (msg: string) => console.log(`\x1b[1;33m[INFO]\x1b[0m ${msg}`),

  success: (msg: string) => console.log(`\x1b[1;32m[SUCCESS]\x1b[0m ${msg}`),

  error: (msg: string) => console.error(`\x1b[1;31m[ERROR]\x1b[0m ${msg}`),

  debug: (msg: string) => console.log(`\x1b[1;34m[DEBUG]\x1b[0m ${msg}`),

};