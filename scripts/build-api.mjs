import { build } from 'esbuild'

await build({
  entryPoints: ['./server/api-entry.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'api/bundle.cjs',
  external: ['express', 'cors', 'helmet', 'express-rate-limit', 'morgan', 'multer', 'sharp', 'bcryptjs', 'dotenv', 'jsonwebtoken', '@supabase/supabase-js', 'zod'],
  sourcemap: false,
  logLevel: 'info',
})
