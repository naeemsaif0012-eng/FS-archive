import 'dotenv/config'

const required = (name: string) => { const value = process.env[name]; if (!value) throw new Error(`${name} is required`) ; return value }
export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  jwtSecret: required('JWT_SECRET'),
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5000').split(',').map(value => value.trim()).filter(Boolean),
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images',
}
