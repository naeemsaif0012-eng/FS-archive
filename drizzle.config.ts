import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({ dialect: 'postgresql', schema: './supabase/migrations/0001_initial_schema.sql', out: './supabase/migrations', dbCredentials: { url: process.env.DATABASE_URL ?? 'postgres://placeholder:placeholder@localhost:5432/fs_archives' } })
