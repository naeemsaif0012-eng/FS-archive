import { z } from 'zod'

export const passwordSchema = z.object({ password: z.string().min(8).max(128) })
export const categorySchema = z.object({ name: z.string().trim().min(1).max(80), slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), main_category: z.enum(['bags', 'jewelry', 'accessories']) })
export const productSchema = z.object({ name: z.string().trim().min(1).max(160), subtitle: z.string().max(200).default(''), description: z.string().max(5000).default(''), price: z.coerce.number().nonnegative(), main_category: z.enum(['bags', 'jewelry', 'accessories']), category: z.string().max(80).default(''), status: z.enum(['available', 'reserved', 'sold']).default('available'), badge: z.enum(['New', 'Limited']).nullable().default(null), quantity: z.coerce.number().int().nonnegative().default(1), images: z.array(z.string().max(2048)).max(10).default([]), bg_class: z.enum(['bg-surface-container', 'bg-surface-container-high', 'bg-surface-container-highest', 'bg-surface-container-lowest', 'bg-bone']).default('bg-surface-container') })
export const featuredSchema = z.object({ productIds: z.array(z.coerce.number().int().positive()).length(4) })
