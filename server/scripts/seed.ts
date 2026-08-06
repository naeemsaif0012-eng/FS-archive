import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import { supabase } from '../supabase.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const read = async <T>(file: string): Promise<T> => JSON.parse(await readFile(path.join(root, 'data', file), 'utf8')) as T

// Seed products and categories
const categories = await read<unknown[]>('categories.json')
const products = await read<unknown[]>('products.json')
const featured = await read<{ productIds: number[] }>('featured-products.json')

const { error: categoryError } = await supabase.from('categories').upsert(categories, { onConflict: 'id' })
if (categoryError) throw categoryError

const { error: productError } = await supabase.from('products').upsert(products, { onConflict: 'id' })
if (productError) throw productError

const { error: featuredError } = await supabase.from('store_settings').upsert({ key: 'featured_product_ids', value: featured.productIds })
if (featuredError) throw featuredError

console.log(`Seeded ${(products as unknown[]).length} products and ${(categories as unknown[]).length} categories.`)

// Seed admin password from ADMIN_PASSWORD env var (idempotent — skips if already set)
const adminPassword = process.env.ADMIN_PASSWORD
if (adminPassword) {
  const { data: existing } = await supabase.from('admin_settings').select('key').eq('key', 'admin_password_hash').maybeSingle()
  if (existing) {
    console.log('Admin password already configured — skipping (delete the row in admin_settings to reset).')
  } else {
    const hash = await bcrypt.hash(adminPassword, 12)
    const { error: adminError } = await supabase.from('admin_settings').insert({ key: 'admin_password_hash', value: hash })
    if (adminError) throw adminError
    console.log('Admin password seeded successfully.')
  }
} else {
  console.log('ADMIN_PASSWORD not set — skipping admin seed. Set it and re-run to configure admin access.')
}
